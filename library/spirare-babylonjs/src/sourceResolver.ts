import urlJoin from 'url-join'
import normalize from 'path-normalize'
import { ResolvedSource } from './types'

type LocalSourceMapping = {
  url: string
  filename?: string
}

export class LocalSourceResolver {
  private pomlPath: string
  private mapping: Map<string, LocalSourceMapping> = new Map()

  constructor(pomlPath: string) {
    this.pomlPath = pomlPath
  }

  public addMapping(src: string, mapping: LocalSourceMapping) {
    this.mapping.set(src, mapping)
  }

  public async resolve(src: string): Promise<ResolvedSource> {
    const pathFromRoot = normalize(`${this.pomlPath}/../${src}`)
    const mapped = this.mapping.get(pathFromRoot)

    if (mapped === undefined) {
      return { success: false }
    }
    return {
      success: true,
      src: mapped.url,
      filename: mapped.filename,
    }
  }
}

export class WebSourceResolver {
  type: 'webUrl' = 'webUrl'
  public readonly pomlUrl?: URL

  constructor(pomlUrl?: string) {
    if (pomlUrl) {
      this.pomlUrl = new URL(pomlUrl)
    }
  }

  public async resolve(src: string): Promise<ResolvedSource> {
    const h = /^(http|https):\/\/[a-zA-Z_0-9]/
    if (h.test(src)) {
      // src: 'https://example.com/foo/bar.glb'
      return {
        success: true,
        src: src,
      }
    }
    if (/^\/\/[a-zA-Z_0-9]/.test(src)) {
      // src: '//example.com/foo/bar.glb'
      // Omitting the protocol.
      if (this.pomlUrl) {
        return {
          success: true,
          src: this.pomlUrl.protocol + src,
        }
      }
      return { success: false }
    }

    if (/^\/\w/.test(src)) {
      // src: '/foo/bar.glb'
      // Absolute path from the host of the pomlUrl.
      if (this.pomlUrl) {
        const { protocol, host } = this.pomlUrl
        return {
          success: true,
          src: urlJoin(`${protocol}//${host}`, src),
        }
      }
    }

    if (this.pomlUrl) {
      // Src is relative path.
      const { protocol, host, pathname } = this.pomlUrl
      const x = pathname.substring(0, pathname.lastIndexOf('/'))
      return {
        success: true,
        src: urlJoin(`${protocol}//${host}${x}`, src),
      }
    }

    return { success: false }
  }
}
