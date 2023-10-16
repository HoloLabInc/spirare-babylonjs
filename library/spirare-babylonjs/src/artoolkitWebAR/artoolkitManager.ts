import ARToolkitModule from '@ar-js-org/artoolkit5-js'

type MarkerInfo = {
  spaceId: string
  pattern: string
}

type DetectedMarker = {
  index: number
  markerId: number
  markerInfo: MarkerInfo
  detectionStartedTime: number
}

export class ARToolkitManager {
  private arController: ARToolkitModule.ARController | undefined
  private markerIdMap = new Map<number, MarkerInfo>()
  private detectionStartedTimeMap = new Map<number, number>()

  public async initializeAsync(
    width: number,
    height: number,
    cameraParamUrl: string
  ) {
    this.arController = await ARToolkitModule.ARController.initWithDimensions(
      width,
      height,
      cameraParamUrl
    )
  }

  public async addMarkersAsync(markerInfoList: MarkerInfo[]) {
    if (this.arController === undefined) {
      return
    }

    const arId = (this.arController as any).id
    const artoolkit = this.arController.artoolkit

    markerInfoList.forEach(async (markerInfo) => {
      const markerId = await (artoolkit.addMarker(
        arId,
        markerInfo.pattern
      ) as unknown as Promise<number>)

      this.markerIdMap.set(markerId, markerInfo)
    })
  }

  public detectMarkers(videoElement: HTMLVideoElement) {
    if (this.arController === undefined) {
      return []
    }

    const result = this.arController.detectMarker(videoElement)
    if (result !== 0) {
      // ARToolkit returning a value !== 0 means an error occured
      console.log('Error detecting markers')
      return []
    }

    const detectedMarkers: DetectedMarker[] = []

    for (let i = 0; i < this.arController.getMarkerNum(); i++) {
      const markerObj = this.arController.getMarker(i) as { idPatt: number }
      const markerId = markerObj.idPatt

      const markerInfo = this.markerIdMap.get(markerId)
      const detectionStartedTime =
        this.detectionStartedTimeMap.get(markerId) ?? Date.now()

      if (markerInfo !== undefined) {
        detectedMarkers.push({
          index: i,
          markerId: markerId,
          markerInfo: markerInfo,
          detectionStartedTime: detectionStartedTime,
        })
      }
    }

    this.detectionStartedTimeMap = new Map(
      detectedMarkers.map((m) => [m.markerId, m.detectionStartedTime])
    )

    return detectedMarkers
  }
}
