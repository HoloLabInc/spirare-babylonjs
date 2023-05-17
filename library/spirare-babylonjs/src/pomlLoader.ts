import { Scene, TransformNode } from '@babylonjs/core'
import JSZip from 'jszip'
import {
  MaybePomlElement,
  Poml,
  PomlElement,
  PomlEmptyElement,
  PomlUnknown,
} from 'ts-poml'
import { PomlParser } from 'ts-poml/dist/pomlParser'
import { getApp } from './app'
import { PomlElementStore } from './pomlElementStore'
import { LocalSourceResolver, WebSourceResolver } from './sourceResolver'
import {
  CreateNodeParams,
  createSpirareNode,
  MaybeSpirareNode,
  SpirareNode,
} from './spirareNode/spirareNode'
import { SourceResolver } from './types'

export type LoadPomlResult = {
  poml: Poml
  nodes: MaybeSpirareNode[]
}

export type LoadPomlOptions = {
  createSceneRootNode?: boolean
}

export class PomlLoader {
  private readonly parser: PomlParser

  constructor() {
    this.parser = new PomlParser()
  }

  /**
   * Load poml from URL.
   *
   * @param {Scene} scene The scene to load to.
   * @param {string} url The URL of the poml to load.
   * @param {(Record<string, string> | undefined)} [headers=undefined] HTTP headers to be sent with the request.
   * @return {*}  {Promise<LoadPomlResult>} The loaded poml and all generated SpirareNodes.
   * @memberof PomlLoader
   */
  public async loadPomlUrlAsync(
    scene: Scene,
    url: string,
    headers: Record<string, string> | undefined = undefined,
    options?: LoadPomlOptions
  ): Promise<LoadPomlResult> {
    const init: RequestInit = {
      headers,
    }
    const response = await fetch(url, init)
    const pomlText = await response.text()
    const poml = this.parser.parse(pomlText)

    // Convert relative URLs to absolute URLs
    const resolver = new WebSourceResolver(url)
    await this.resolveSource(
      poml.scene.children.filter((x): x is PomlElement => x.type !== '?'),
      resolver
    )

    return this.loadPomlAsync(scene, poml, options)
  }

  /**
   * Load poml text.
   *
   * @param {Scene} scene The scene to load to.
   * @param {string} pomlText poml text
   * @return {*}  {Promise<LoadPomlResult>} The loaded poml and all generated SpirareNodes.
   * @memberof PomlLoader
   */
  public async loadPomlTextAsync(
    scene: Scene,
    pomlText: string,
    options?: LoadPomlOptions
  ): Promise<LoadPomlResult> {
    const poml = this.parser.parse(pomlText)
    return this.loadPomlAsync(scene, poml, options)
  }

  /**
   * Load PomlElement
   *
   * @template T
   * @param {T | PomlUnknownElement} element The PomlElement to load.
   * @param {TransformNode} [parent] The object that becomes the parent of the SpirareNode created from the PomlElement.
   * @return {*}  {Promise<{
   *     node: SpirareNode<T['type']>
   *     allNodes: SpirareNode[]
   *   }>}
   * The SpirareNode corresponding to the loaded PomlElement and all SpirareNodes of itself and its child elements.
   * @memberof PomlLoader
   */
  public async loadPomlElementAsync<T extends MaybePomlElement>(
    element: T,
    params: CreateNodeParams,
    parent?: TransformNode
  ): Promise<{
    node: MaybeSpirareNode<T['type']>
    allNodes: MaybeSpirareNode[]
  }> {
    const node = await createSpirareNode(element, params)
    if (parent) {
      node.parent = parent
    }

    if (params.store) {
      if (node.type !== '?') {
        params.store.RegisterElement(node)
      }
    }

    if (node.type === '?') {
      // T is PomlUnknown here
      return {
        node: node,
        allNodes: [node],
      }
    } else {
      const childrenParams: CreateNodeParams = {
        ...params,
        parentNode: node,
      }

      const children = element.type !== '?' ? element.children : []
      const allNodes: MaybeSpirareNode[] = children
        ? await Promise.all(
            children.map((ele) => {
              return this.loadPomlElementAsync(ele, childrenParams, node)
            })
          ).then((loaded) => loaded.flatMap((x) => x.allNodes))
        : []

      allNodes.push(node)

      return {
        node: node,
        allNodes: allNodes,
      }
    }

    // const childrenParams: CreateNodeParams = {
    //   ...params,
    //   parentNode: node,
    // }

    // const children = element.type !== '?' ? element.children : []
    // const allNodes: SpirareNode[] = children
    //   ? await Promise.all(
    //       children.map((ele) => {
    //         return this.loadPomlElementAsync(ele, childrenParams, node)
    //       })
    //     ).then((loaded) => loaded.flatMap((x) => x.allNodes))
    //   : []

    // allNodes.push(node)

    // return {
    //   node: node,
    //   allNodes: allNodes,
    // }
  }

  /**
   * Load poml zip.
   *
   * @param {Blob} pomlZip The poml zip to load.
   * @param {Scene} scene The scene to load to.
   * @return {*}  {(Promise<LoadPomlResult | undefined>)} The loaded Poml and all generated SpirareNodes. Undefined if failed.
   * @memberof PomlLoader
   */
  public async loadPomlZipAsync(
    pomlZip: Blob,
    scene: Scene,
    options?: LoadPomlOptions
  ): Promise<LoadPomlResult | undefined> {
    // -----------------------------------
    // [Expected structure of zip]
    //
    // sample.zip
    //   |--- sample.poml
    //   `--- models
    //          |--- foo.glb
    //          `--- bar.glb
    //
    // -----------------------------------

    const app = getApp(scene)
    if (!app) {
      return undefined
    }

    const unziped = await JSZip.loadAsync(pomlZip)
    const pomlRegex = /(?<name>.*)\.((xml)|(poml))$/
    const pomlFile = unziped.file(pomlRegex).pop()
    if (!pomlFile) {
      console.error('No poml file exist')
      return undefined
    }

    // Upload the data in the zip file
    const pomlPath = pomlFile.name
    const resolver = new LocalSourceResolver(pomlPath)

    const dataRegex = /^(?!.*(xml|poml)$).*$/
    const dataFiles = unziped.file(dataRegex)

    await Promise.all(
      dataFiles.map(async (file) => {
        // 'sample/foo.glb'
        const zipRelativePath = file.name

        // 'foo.glb'
        const filename = file.name.split('/').pop() ?? ''

        const uploadResult = await app.uploadFile({
          isLocalFile: false,
          data: await (await file.async('blob')).arrayBuffer(),
          name: filename,
        })

        if (uploadResult.success) {
          resolver.addMapping(zipRelativePath, {
            url: uploadResult.src,
            filename: uploadResult.filename,
          })
        } else {
          return undefined
        }
      })
    )

    // Get poml
    const pomlText = await pomlFile.async('text')
    const poml = this.parser.parse(pomlText)

    // Convert relative paths in poml to uploaded file paths
    await this.resolveSource(
      poml.scene.children.filter((x): x is PomlElement => x.type !== '?'),
      resolver
    )

    return this.loadPomlAsync(scene, poml, options)
  }

  private async loadPomlAsync(
    scene: Scene,
    poml: Poml,
    options?: LoadPomlOptions
  ): Promise<LoadPomlResult> {
    const store = new PomlElementStore()
    const params: CreateNodeParams = {
      scene: scene,
      store: store,
    }

    let loaded
    if (options?.createSceneRootNode) {
      const sceneElement = new PomlEmptyElement({
        ...poml.scene,
      })
      loaded = [await this.loadPomlElementAsync(sceneElement, params)]
    } else {
      const children = poml.scene.children

      loaded = await Promise.all(
        children.map((ele) => this.loadPomlElementAsync(ele, params))
      )
    }

    const nodes = loaded.flatMap((x) => x.allNodes)

    // Activate script components after all elements loaded
    nodes.forEach((x) => {
      if (x.type !== '?') {
        x.activateScriptComponents()
      }
    })

    return {
      poml,
      nodes,
    }
  }

  private async resolveSource(
    elements: PomlElement[],
    resolver: SourceResolver
  ) {
    const resolve = async (element: { src?: string; filename?: string }) => {
      if (element.src) {
        const resolvedSrc = await resolver.resolve(element.src)
        if (resolvedSrc.success) {
          element.src = resolvedSrc.src
          if (resolvedSrc.filename) {
            element.filename = resolvedSrc.filename
          }
        }
      }
    }

    await Promise.all(
      elements.map(async (element) => {
        switch (element.type) {
          case 'model':
          case 'image':
          case 'video':
            await resolve(element)
        }
        await Promise.all(
          element.scriptElements.map(async (x) => {
            await resolve(x)
          })
        )
        await this.resolveSource(
          element.children.filter((x): x is PomlElement => x.type !== '?'),
          resolver
        )
      })
    )
  }
}
