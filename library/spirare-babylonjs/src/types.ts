export type AppRunMode = 'editor' | 'viewer'
export type PlacementMode = 'space' | 'geodetic'
export type AppDisplayMode = 'normal' | 'ar'

export type PomlPathMode = 'id' | 'path'

export type SpirareEventType = 'start' | 'update' | 'select'
export type InvokableSpirareEventType = Exclude<SpirareEventType, 'start'>

export type CameraSpaceType = 'world-space' | 'screen-space'

export type UploadFileResult =
  | { success: false }
  | { success: true; src: string; filename?: string }

export type FileData =
  | {
      isLocalFile: false
      name: string
      data: ArrayBuffer
    }
  | {
      isLocalFile: true
      filepath: string
      data: ArrayBuffer
    }

export type ResolvedSource =
  | { success: false }
  | { success: true; src: string; filename?: string }

export type SourceResolver = {
  resolve: (src: string) => Promise<ResolvedSource>
}

export type SceneIdentifier = {
  pomlPathMode: PomlPathMode
  pomlId: string | undefined
  pomlPath: string | undefined
}

export type SceneInfo = {
  title: string | undefined
  pomlPathMode: PomlPathMode
  pomlId: string | undefined
  pomlPath: string | undefined
  placementMode: PlacementMode
}

export interface AppLaunchParams {
  placementMode: PlacementMode
  runMode: AppRunMode
  pomlId: string | undefined
  pomlPath: string | undefined
  pomlUrlArray?: string[]
  displayMode?: AppDisplayMode
  startPageUrl?: string
  hideUI?: boolean
  hideInspector?: boolean
  hideOriginAxes?: boolean
}

export type SpaceStatus =
  | {
      type: 'updated'
      position: {
        x: number
        y: number
        z: number
      }
      rotation: {
        x: number
        y: number
        z: number
        w: number
      }
      spaceType: string
      spaceId: string
    }
  | {
      type: 'lost'
      spaceType: string
      spaceId: string
    }

export function getAppLaunchParms(url: string): AppLaunchParams {
  const params = new URLSearchParams(url)
  return {
    placementMode: getPlacementMode(params),
    runMode: getAppRunMode(params),
    pomlId: params.get('pomlId') ?? undefined,
    pomlPath: params.get('pomlPath') ?? undefined,
    pomlUrlArray: getPomlUrlArray(params),
  }
}

export function getUrlParamString(p: AppLaunchParams) {
  let paramString
  if (p.pomlId !== undefined) {
    paramString = `pomlId=${p.pomlId}`
  } else {
    paramString = `pomlPath=${p.pomlPath}`
  }

  if (paramString !== undefined) {
    paramString += `&`
  }

  return `${paramString}run-mode=${p.runMode}&placement-mode=${p.placementMode}`
}

function getPlacementMode(urlParams: URLSearchParams): PlacementMode {
  switch (urlParams.get('placement-mode')) {
    case 'geodetic': {
      return 'geodetic'
    }
    case 'space':
    default: {
      return 'space'
    }
  }
}

function getAppRunMode(urlParams: URLSearchParams): AppRunMode {
  switch (urlParams.get('run-mode')) {
    case 'viewer': {
      return 'viewer'
    }
    case 'editor':
    default: {
      return 'editor'
    }
  }
}

const getPomlUrlArray = (urlParams: URLSearchParams): string[] => {
  return urlParams.getAll('poml-url')
}
