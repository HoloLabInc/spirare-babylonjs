import {
  Camera,
  DeepImmutable,
  Effect,
  Matrix,
  Mesh,
  Quaternion,
  Scene,
  ShaderMaterial,
  Tools,
  Vector2,
  VertexData,
} from '@babylonjs/core'

const vertexShaderSource = `
  precision mediump float;
  attribute vec2 position;

  attribute vec4 world0;
  attribute vec4 world1;
  attribute vec4 world2;
  attribute vec4 world3;

  uniform mat4 world;
  uniform mat4 projection, view;
  uniform vec2 focal;
  uniform vec2 viewport;

  varying vec4 vColor;
  varying vec2 vPosition;
  void main () {
    vec4 modelOrigin = world * vec4(0.0, 0.0, 0.0, 1.0);

    vec3 center = world0.xyz;
    vec4 color = world1;
    vec3 covA = world2.xyz;
    vec3 covB = world3.xyz;

    vec4 camspace = view * world * vec4(center, 1);
    vec4 pos2d = projection * camspace;

    float bounds = 1.2 * pos2d.w;
    if (pos2d.z < -pos2d.w || pos2d.x < -bounds || pos2d.x > bounds
		 || pos2d.y < -bounds || pos2d.y > bounds) {
        gl_Position = vec4(0.0, 0.0, 2.0, 1.0);
        return;
    }

    mat3 Vrk = mat3(
        covA.x, covA.y, covA.z, 
        covA.y, covB.x, covB.y,
        covA.z, covB.y, covB.z
    );
	
    mat3 J = mat3(
        focal.x / camspace.z, 0., -(focal.x * camspace.x) / (camspace.z * camspace.z), 
        0., focal.y / camspace.z, -(focal.y * camspace.y) / (camspace.z * camspace.z), 
        0., 0., 0.
    );

    mat3 invy = mat3(1,0,0, 0,-1,0,0,0,1);

    mat3 T = invy * transpose(mat3(view * world)) * J;
    mat3 cov2d = transpose(T) * Vrk * T;

    float mid = (cov2d[0][0] + cov2d[1][1]) / 2.0;
    float radius = length(vec2((cov2d[0][0] - cov2d[1][1]) / 2.0, cov2d[0][1]));
    float lambda1 = mid + radius, lambda2 = mid - radius;

    if(lambda2 < 0.0) return;
    vec2 diagonalVector = normalize(vec2(cov2d[0][1], lambda1 - cov2d[0][0]));
    vec2 majorAxis = min(sqrt(2.0 * lambda1), 1024.0) * diagonalVector;
    vec2 minorAxis = min(sqrt(2.0 * lambda2), 1024.0) * vec2(diagonalVector.y, -diagonalVector.x);

    vColor = color;
    vPosition = position;
    vec2 vCenter = vec2(pos2d);
    gl_Position = vec4(
        vCenter 
        + (position.x * majorAxis * 1. / viewport 
        + position.y * minorAxis * 1. / viewport) * pos2d.w, pos2d.zw);
  }
`

const fragmentShaderSource = `
  precision highp float;
  varying vec4 vColor;
  varying vec2 vPosition;
  void main () {    
	float A = -dot(vPosition, vPosition);
    if (A < -4.0) discard;
    float B = exp(A) * vColor.a;
    gl_FragColor = vec4(vColor.rgb, B);
  }
`

function createWorker(self: Worker) {
  var viewProj: DeepImmutable<Float32Array | Array<number>>
  let lastProj: DeepImmutable<Float32Array | Array<number>> = []
  var depthMix = new BigInt64Array()
  var vertexCount = 0
  let positions: Float32Array

  const runSort = (viewProj: DeepImmutable<Float32Array | Array<number>>) => {
    vertexCount = positions.length
    if (depthMix.length !== vertexCount) {
      depthMix = new BigInt64Array(vertexCount)
      const indices = new Uint32Array(depthMix.buffer)
      for (let j = 0; j < vertexCount; j++) {
        indices[2 * j] = j
      }
    }
    let dot =
      lastProj[2] * viewProj[2] +
      lastProj[6] * viewProj[6] +
      lastProj[10] * viewProj[10]
    if (Math.abs(dot - 1) < 0.01) {
      return
    }

    const floatMix = new Float32Array(depthMix.buffer)
    const indexMix = new Uint32Array(depthMix.buffer)
    for (let j = 0; j < vertexCount; j++) {
      let i = indexMix[2 * j]
      floatMix[2 * j + 1] =
        10000 -
        (viewProj[2] * positions[3 * i + 0] +
          viewProj[6] * positions[3 * i + 1] +
          viewProj[10] * positions[3 * i + 2])
    }
    lastProj = viewProj

    depthMix.sort()

    self.postMessage({ depthMix }, [depthMix.buffer])
  }

  const throttledSort = () => {
    if (!sortRunning) {
      sortRunning = true
      let lastView = viewProj
      runSort(lastView)
      setTimeout(() => {
        sortRunning = false
        if (lastView !== viewProj) {
          throttledSort()
        }
      }, 0)
    }
  }

  let sortRunning: boolean
  self.onmessage = (e) => {
    viewProj = e.data.view
    positions = e.data.positions
    throttledSort()
  }
}

function setData(binaryData: Uint8Array) {
  const rowLength = 3 * 4 + 3 * 4 + 4 + 4
  const vertexCount = binaryData.length / rowLength
  const positions = new Float32Array(3 * vertexCount)
  const covA = new Float32Array(3 * vertexCount)
  const covB = new Float32Array(3 * vertexCount)

  const f_buffer = new Float32Array(binaryData.buffer)
  const u_buffer = new Uint8Array(binaryData.buffer)

  let matrixRotation = Matrix.Zero()
  let matrixScale = Matrix.Zero()
  let quaternion = Quaternion.Identity()
  for (let i = 0; i < vertexCount; i++) {
    positions[3 * i + 0] = f_buffer[8 * i + 0]
    positions[3 * i + 1] = -f_buffer[8 * i + 1]
    positions[3 * i + 2] = f_buffer[8 * i + 2]

    quaternion.set(
      (u_buffer[32 * i + 28 + 1] - 128) / 128,
      (u_buffer[32 * i + 28 + 2] - 128) / 128,
      (u_buffer[32 * i + 28 + 3] - 128) / 128,
      -(u_buffer[32 * i + 28 + 0] - 128) / 128
    )
    quaternion.toRotationMatrix(matrixRotation)

    Matrix.ScalingToRef(
      f_buffer[8 * i + 3 + 0] * 2,
      f_buffer[8 * i + 3 + 1] * 2,
      f_buffer[8 * i + 3 + 2] * 2,
      matrixScale
    )

    const M = matrixRotation.multiply(matrixScale).m

    covA[i * 3 + 0] = M[0] * M[0] + M[1] * M[1] + M[2] * M[2]
    covA[i * 3 + 1] = M[0] * M[4] + M[1] * M[5] + M[2] * M[6]
    covA[i * 3 + 2] = M[0] * M[8] + M[1] * M[9] + M[2] * M[10]
    covB[i * 3 + 0] = M[4] * M[4] + M[5] * M[5] + M[6] * M[6]
    covB[i * 3 + 1] = M[4] * M[8] + M[5] * M[9] + M[6] * M[10]
    covB[i * 3 + 2] = M[8] * M[8] + M[9] * M[9] + M[10] * M[10]
  }

  return {
    vertexCount,
    positions,
    u_buffer,
    covA,
    covB,
  }
}

export class GaussianSplatLoader {
  public static async importWithUrlAsync(url: string, scene: Scene) {
    const data = (await Tools.LoadFileAsync(url, true)) as ArrayBuffer
    const { vertexCount, positions, u_buffer, covA, covB } = setData(
      new Uint8Array(data)
    )

    Effect.ShadersStore['customVertexShader'] = vertexShaderSource
    Effect.ShadersStore['customFragmentShader'] = fragmentShaderSource
    const shaderMaterial = new ShaderMaterial(
      'shader',
      scene,
      {
        vertex: 'custom',
        fragment: 'custom',
      },
      {
        attributes: ['position', 'normal', 'uv'],
        uniforms: [
          'world',
          'worldView',
          'worldViewProjection',
          'view',
          'projection',
        ],
      }
    )
    const quad = new Mesh('custom', scene)
    var vertexData = new VertexData()
    vertexData.positions = [-2, -2, 0, 2, -2, 0, 2, 2, 0, -2, 2, 0]
    vertexData.indices = [0, 1, 2, 0, 2, 3]

    vertexData.applyToMesh(quad)

    shaderMaterial.setVector2('focal', new Vector2(1132, 1132))
    const engine = scene.getEngine()
    shaderMaterial.setVector2(
      'viewport',
      new Vector2(engine.getRenderWidth(), engine.getRenderHeight())
    )
    quad.material = shaderMaterial
    shaderMaterial.backFaceCulling = false
    shaderMaterial.alpha = 0.9999
    quad.alwaysSelectAsActiveMesh = true

    var matricesData = new Float32Array(vertexCount * 16)
    var firstTime = true

    const updateInstances = function (idxMix: Uint32Array) {
      for (let j = 0; j < vertexCount; j++) {
        const i = idxMix[2 * j]
        const index = j * 16
        matricesData[index + 0] = positions[i * 3 + 0]
        matricesData[index + 1] = positions[i * 3 + 1]
        matricesData[index + 2] = positions[i * 3 + 2]

        matricesData[index + 4] = u_buffer[32 * i + 24 + 0] / 255
        matricesData[index + 5] = u_buffer[32 * i + 24 + 1] / 255
        matricesData[index + 6] = u_buffer[32 * i + 24 + 2] / 255
        matricesData[index + 7] = u_buffer[32 * i + 24 + 3] / 255

        matricesData[index + 8] = covA[i * 3 + 0]
        matricesData[index + 9] = covA[i * 3 + 1]
        matricesData[index + 10] = covA[i * 3 + 2]

        matricesData[index + 12] = covB[i * 3 + 0]
        matricesData[index + 13] = covB[i * 3 + 1]
        matricesData[index + 14] = covB[i * 3 + 2]
      }

      if (firstTime) {
        quad.thinInstanceSetBuffer('matrix', matricesData, 16, false)
      } else {
        quad.thinInstanceBufferUpdated('matrix')
      }
      firstTime = false
    }

    const worker = new Worker(
      URL.createObjectURL(
        new Blob(['(', createWorker.toString(), ')(self)'], {
          type: 'application/javascript',
        })
      )
    )

    worker.onmessage = (e) => {
      const indexMix = new Uint32Array(e.data.depthMix.buffer)
      updateInstances(indexMix)
    }
    scene.onBeforeRenderObservable.add(() => {
      const camera = scene._activeCamera as Camera
      const view = camera.getViewMatrix().multiply(quad._worldMatrix).m
      worker.postMessage({
        view: view,
        positions: positions,
      })
    })

    return { meshes: [quad] }
  }
}
