import { Scene } from '@babylonjs/core'
import {
  Poml,
  CoordinateReference,
  SpaceReference,
  PomlElement,
  Meta,
  MaybePomlElement,
} from 'ts-poml'
import { BuildOptions, PomlParser } from 'ts-poml/dist/pomlParser'
import JSZip from 'jszip'
import {
  findMaybeSpirareNodes,
  findSpirareNodes,
  isSpirareNode,
  SpirareNode,
} from './spirareNode/spirareNode'
import { App, getApp } from './app'
import { CoordinateConverter } from './coordinateConverter'

class NamedBlob {
  path: string
  blob: Blob
  constructor(path: string, blob: Blob) {
    this.path = path
    this.blob = blob
  }
}

export interface PomlBuilderResult {
  pomlText: string
  pomlzBlob: Blob | undefined
}

export class PomlBuilder {
  private readonly parser: PomlParser
  constructor() {
    this.parser = new PomlParser()
  }

  public async buildPoml(
    scene: Scene,
    coordinateReferences: CoordinateReference[],
    options?: BuildOptions
  ): Promise<string> {
    const app = getApp(scene)

    const nodes = findMaybeSpirareNodes(scene)
    nodes.forEach((n) => {
      if (n.type !== '?') {
        n.updateElement()
      }
    })

    coordinateReferences = this.updateCoordinateReferences(
      nodes.filter((n): n is SpirareNode => n.type !== '?'),
      coordinateReferences,
      app
    )

    const poml = new Poml()

    const title = app.title
    if (title) {
      poml.meta = new Meta({
        title: title,
      })
    }

    const elements = nodes.map((n) => {
      return n.element
    })

    poml.scene.children = elements
    poml.scene.coordinateReferences = coordinateReferences
    const pomlText = this.parser.build(poml, options)

    return pomlText
  }

  public async buildPomlZip(
    scene: Scene,
    pomlFileName: string,
    coordinateReferences: CoordinateReference[],
    options?: BuildOptions
  ): Promise<PomlBuilderResult> {
    const app = getApp(scene)
    if (!app) {
      throw new Error('cannot get app')
    }

    const nodes = findMaybeSpirareNodes(scene)
    nodes.forEach((n) => {
      if (n.type !== '?') {
        n.updateElement()
      }
    })

    const spirareNodes = nodes.filter((n): n is SpirareNode => n.type !== '?');
    coordinateReferences = this.updateCoordinateReferences(
      spirareNodes,
      coordinateReferences,
      app
    )

    const { elementBlobMap, namedBlobs } = await PomlBuilder.getSrcBlobMapAsync(
      spirareNodes,
      app
    )

    // Set up configuration to override src and filename when exporting
    const overrideProperties = new Map<PomlElement, object>()
    elementBlobMap.forEach((blob, element) => {
      const filepath = blob.path
      const property = { src: filepath, filename: undefined }
      overrideProperties.set(element, property)
    })

    // Create poml string
    const poml = new Poml()
    const elements = nodes.map((n) => n.element)
    poml.scene.children = PomlBuilder.overridePomlElements(
      elements,
      overrideProperties
    )
    poml.scene.coordinateReferences = coordinateReferences
    const pomlText = this.parser.build(poml, options)

    let pomlzBlob = undefined

    if (namedBlobs.length > 0) {
      pomlzBlob = await PomlBuilder.createZip(
        pomlFileName,
        pomlText,
        namedBlobs
      )
    }
    return {
      pomlText: pomlText,
      pomlzBlob: pomlzBlob,
    }
  }

  private updateCoordinateReferences(
    nodes: SpirareNode[],
    coordinateReferences: CoordinateReference[],
    app: App
  ) {
    // If placement mode is 'space' and the scene is empty,
    // add empty space-reference tag to destinguish placement mode.
    if (app.placementMode === 'space') {
      if (nodes.length === 0 && coordinateReferences.length === 0) {
        coordinateReferences.push({
          type: 'space-reference',
          spaceId: '',
          spaceType: '',
        })
      }
    }

    if (app.placementMode === 'space') {
      const spaceOriginPlacements = getSpaceOriginPlacements(nodes)
      coordinateReferences = coordinateReferences.concat(spaceOriginPlacements)
    }
    return coordinateReferences
  }

  /**
   * Override some properties of PomlElement.
   * @param elements
   * @param overrideProperties
   * @returns
   */
  private static overridePomlElements(
    elements: MaybePomlElement[],
    overrideProperties: Map<PomlElement, object>
  ): MaybePomlElement[] {
    const newElements = elements.map((element) => {
      if (element.type === '?') {
        return element
      }
      const newElement = { ...element }
      const overrideProperty = overrideProperties.get(element)
      if (overrideProperty) {
        Object.assign(newElement, overrideProperty)
      }
      newElement.children = this.overridePomlElements(
        newElement.children,
        overrideProperties
      )
      return newElement
    })
    return newElements
  }

  /**
   * Create a mapping of PomlElements and NamedBlobs based on the 'src' property.
   * @param nodes The SpirareNodes to create the mapping from.
   * @param app The app object.
   * @returns A map of PomlElements and NamedBlobs based on the 'src' property.
   */
  private static async getSrcBlobMapAsync(nodes: SpirareNode[], app: App) {
    // To make file names unique, keep track of the file names to be exported.
    const blobNameSet = new Set<string>()

    // Map of 'src' properties to NamedBlobs.
    const srcBlobMap = new Map<string, NamedBlob>()

    // Map of PomlElements to NamedBlobs.
    const elementBlobMap = new Map<PomlElement, NamedBlob>()

    for (const node of nodes) {
      const element = node.element

      if ('src' in element && element.src !== undefined) {
        // If multiple Elements have the same 'src' property, they will be associated with the same NamedBlob.
        const existingBlob = srcBlobMap.get(element.src)
        if (existingBlob !== undefined) {
          elementBlobMap.set(element, existingBlob)
        } else {
          const blob = await this.getSrcFileAsync(
            {
              type: element.type,
              src: element.src,
              filename: element.filename,
            },
            blobNameSet,
            app
          )

          if (blob !== undefined) {
            blobNameSet.add(blob.path)
            srcBlobMap.set(element.src, blob)
            elementBlobMap.set(element, blob)
          }
        }
      }
    }
    return {
      elementBlobMap: elementBlobMap,
      namedBlobs: Array.from(srcBlobMap.values()),
    }
  }

  private static async getSrcFileAsync(
    element: {
      type: 'model' | 'video' | 'image' | 'cesium3dtiles'
      src: string
      filename?: string
    },
    existingNameSet: Set<string>,
    app: App
  ): Promise<NamedBlob | undefined> {
    let src = element.src

    if (app.sourceResolver) {
      const resolved = await app.sourceResolver.resolve(src)
      if (resolved.success) {
        src = resolved.src
      }
    }

    const path = this.generateExportFilePath(element, existingNameSet)

    // For HTTP URLs
    if (src.startsWith('http:') || src.startsWith('https:')) {
      return undefined
    }

    // For blob URLs
    if (src.startsWith('blob:')) {
      const response = await fetch(src)
      if (response.ok) {
        const blob = await response.blob()
        return new NamedBlob(path, blob)
      }
      return undefined
    }

    // For local files
    const response = await fetch(src)
    if (response.ok) {
      const blob = await response.blob()
      return new NamedBlob(path, blob)
    }
    return undefined
  }

  /**
   * Generate the file path for exporting.
   * @param element The element to be exported.
   * @param existingNameSet Set of existing file names to ensure file name uniqueness.
   * @returns The generated file path.
   */
  private static generateExportFilePath(
    element: {
      type: 'model' | 'video' | 'image' | 'cesium3dtiles'
      src: string
      filename?: string
    },
    existingNameSet: Set<string>
  ): string {
    let folderName: string
    switch (element.type) {
      case 'model':
        folderName = 'models'
        break
      case 'image':
        folderName = 'images'
        break
      case 'video':
        folderName = 'videos'
        break
      case 'cesium3dtiles':
        folderName = 'cesium3dtiles'
        break
    }

    const filename = element.filename
    const filenameFromSrc = element.src.replace(/^.*[\\\/]/, '')

    const name = filename ?? filenameFromSrc

    const pathCandidate = `${folderName}/${name}`
    const generator = filenameGenerator(pathCandidate)

    for (;;) {
      const next = generator.next()
      const path = next.value as string
      if (existingNameSet.has(path) === false) {
        return path
      }
    }
  }

  private static async createZip(
    name: string,
    pomlText: string,
    blobs: NamedBlob[]
  ): Promise<Blob> {
    const zipRoot = new JSZip()
    zipRoot.file(`${name}.poml`, pomlText)

    blobs.forEach((b) => {
      zipRoot.file(b.path, b.blob)
    })

    return await zipRoot.generateAsync({ type: 'blob' })
  }
}

const getSpaceOriginPlacements = (
  nodes: SpirareNode[]
): CoordinateReference[] => {
  const coordinateReferences: CoordinateReference[] = []
  nodes.forEach((n) => {
    const spaceOrigin = n.customProperty.spaceOrigin
    if (spaceOrigin?.enabled && spaceOrigin?.spaceId) {
      const position = CoordinateConverter.toSpirarePosition(n.absolutePosition)
      const rotation = CoordinateConverter.toSpirareQuaternion(
        n.absoluteRotationQuaternion
      )

      const spaceReference: SpaceReference = {
        type: 'space-reference',
        spaceId: spaceOrigin.spaceId,
        spaceType: spaceOrigin.spaceType,
        position,
        rotation,
      }

      coordinateReferences.push(spaceReference)
    }
  })
  return coordinateReferences
}

function* filenameGenerator(originalName: string) {
  yield originalName

  const dotIndex = originalName.indexOf('.')

  let filenameWithoutExtension: string
  let extension: string

  if (dotIndex == -1) {
    filenameWithoutExtension = originalName
    extension = ''
  } else {
    filenameWithoutExtension = originalName.substring(0, dotIndex)
    extension = originalName.substring(dotIndex)
  }

  for (let i = 1; ; i++) {
    yield `${filenameWithoutExtension}_${i}${extension}`
  }
}
