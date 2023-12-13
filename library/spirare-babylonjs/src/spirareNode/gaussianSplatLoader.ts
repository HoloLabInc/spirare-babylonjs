/*
# Apache License 2.0 (Apache)

Apache License
Version 2.0, January 2004
<http://www.apache.org/licenses/>

TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

## Definitions

"License" shall mean the terms and conditions for use, reproduction, and distribution as defined by Sections 1 through 9 of this document.

"Licensor" shall mean the copyright owner or entity authorized by the copyright owner that is granting the License.

"Legal Entity" shall mean the union of the acting entity and all other entities that control, are controlled by, or are under common control with that entity. For the purposes of this definition, "control" means (i) the power, direct or indirect, to cause the direction or management of such entity, whether by contract or otherwise, or (ii) ownership of fifty percent (50%) or more of the outstanding shares, or (iii) beneficial ownership of such entity.

"You" (or "Your") shall mean an individual or Legal Entity exercising permissions granted by this License.

"Source" form shall mean the preferred form for making modifications, including but not limited to software source code, documentation source, and configuration files.

"Object" form shall mean any form resulting from mechanical transformation or translation of a Source form, including but not limited to compiled object code, generated documentation, and conversions to other media types.

"Work" shall mean the work of authorship, whether in Source or Object form, made available under the License, as indicated by a copyright notice that is included in or attached to the work (an example is provided in the Appendix below).

"Derivative Works" shall mean any work, whether in Source or Object form, that is based on (or derived from) the Work and for which the editorial revisions, annotations, elaborations, or other modifications represent, as a whole, an original work of authorship. For the purposes of this License, Derivative Works shall not include works that remain separable from, or merely link (or bind by name) to the interfaces of, the Work and Derivative Works thereof.

"Contribution" shall mean any work of authorship, including the original version of the Work and any modifications or additions to that Work or Derivative Works thereof, that is intentionally submitted to Licensor for inclusion in the Work by the copyright owner or by an individual or Legal Entity authorized to submit on behalf of the copyright owner. For the purposes of this definition, "submitted" means any form of electronic, verbal, or written communication sent to the Licensor or its representatives, including but not limited to communication on electronic mailing lists, source code control systems, and issue tracking systems that are managed by, or on behalf of, the Licensor for the purpose of discussing and improving the Work, but excluding communication that is conspicuously marked or otherwise designated in writing by the copyright owner as "Not a Contribution."

"Contributor" shall mean Licensor and any individual or Legal Entity on behalf of whom a Contribution has been received by Licensor and subsequently incorporated within the Work.

## Grant of Copyright License

Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable copyright license to reproduce, prepare Derivative Works of, publicly display, publicly perform, sublicense, and distribute the Work and such Derivative Works in Source or Object form.

## Grant of Patent License

Subject to the terms and conditions of this License, each Contributor hereby grants to You a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable (except as stated in this section) patent license to make, have made, use, offer to sell, sell, import, and otherwise transfer the Work, where such license applies only to those patent claims licensable by such Contributor that are necessarily infringed by their Contribution(s) alone or by combination of their Contribution(s) with the Work to which such Contribution(s) was submitted. If You institute patent litigation against any entity (including a cross-claim or counterclaim in a lawsuit) alleging that the Work or a Contribution incorporated within the Work constitutes direct or contributory patent infringement, then any patent licenses granted to You under this License for that Work shall terminate as of the date such litigation is filed.

## Redistribution

You may reproduce and distribute copies of the Work or Derivative Works thereof in any medium, with or without modifications, and in Source or Object form, provided that You meet the following conditions:

1. You must give any other recipients of the Work or Derivative Works a copy of this License; and

2. You must cause any modified files to carry prominent notices stating that You changed the files; and

3. You must retain, in the Source form of any Derivative Works that You distribute, all copyright, patent, trademark, and attribution notices from the Source form of the Work, excluding those notices that do not pertain to any part of the Derivative Works; and

4. If the Work includes a "NOTICE" text file as part of its distribution, then any Derivative Works that You distribute must include a readable copy of the attribution notices contained within such NOTICE file, excluding those notices that do not pertain to any part of the Derivative Works, in at least one of the following places: within a NOTICE text file distributed as part of the Derivative Works; within the Source form or documentation, if provided along with the Derivative Works; or, within a display generated by the Derivative Works, if and wherever such third-party notices normally appear. The contents of the NOTICE file are for informational purposes only and do not modify the License. You may add Your own attribution notices within Derivative Works that You distribute, alongside or as an addendum to the NOTICE text from the Work, provided that such additional attribution notices cannot be construed as modifying the License.

You may add Your own copyright statement to Your modifications and may provide additional or different license terms and conditions for use, reproduction, or distribution of Your modifications, or for any such Derivative Works as a whole, provided Your use, reproduction, and distribution of the Work otherwise complies with the conditions stated in this License.

## Submission of Contributions

Unless You explicitly state otherwise, any Contribution intentionally submitted for inclusion in the Work by You to the Licensor shall be under the terms and conditions of this License, without any additional terms or conditions. Notwithstanding the above, nothing herein shall supersede or modify the terms of any separate license agreement you may have executed with Licensor regarding such Contributions.

## Trademarks

This License does not grant permission to use the trade names, trademarks, service marks, or product names of the Licensor, except as required for reasonable and customary use in describing the origin of the Work and reproducing the content of the NOTICE file.

## Disclaimer of Warranty

Unless required by applicable law or agreed to in writing, Licensor provides the Work (and each Contributor provides its Contributions) on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including, without limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE. You are solely responsible for determining the appropriateness of using or redistributing the Work and assume any risks associated with Your exercise of permissions under this License.

## Limitation of Liability

In no event and under no legal theory, whether in tort (including negligence), contract, or otherwise, unless required by applicable law (such as deliberate and grossly negligent acts) or agreed to in writing, shall any Contributor be liable to You for damages, including any direct, indirect, special, incidental, or consequential damages of any character arising as a result of this License or out of the use or inability to use the Work (including but not limited to damages for loss of goodwill, work stoppage, computer failure or malfunction, or any and all other commercial damages or losses), even if such Contributor has been advised of the possibility of such damages.

## Accepting Warranty or Additional Liability

While redistributing the Work or Derivative Works thereof, You may choose to offer, and charge a fee for, acceptance of support, warranty, indemnity, or other liability obligations and/or rights consistent with this License. However, in accepting such obligations, You may act only on Your own behalf and on Your sole responsibility, not on behalf of any other Contributor, and only if You agree to indemnify, defend, and hold each Contributor harmless for any liability incurred by, or claims asserted against, such Contributor by reason of your accepting any such warranty or additional liability.
*/

// Modification copyright (c) 2023 HoloLab Inc.

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
      const view = quad._worldMatrix.multiply(camera.getViewMatrix()).m
      worker.postMessage({
        view: view,
        positions: positions,
      })
    })

    return { meshes: [quad] }
  }
}
