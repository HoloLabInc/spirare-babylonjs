export const startCameraStream = async (
  videoElement: HTMLVideoElement,
  constraints: MediaStreamConstraints
): Promise<boolean> => {
  return new Promise(async (resolve) => {
    try {
      videoElement.addEventListener('loadedmetadata', function () {
        resolve(true)
      })

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      videoElement.srcObject = stream
    } catch (error) {
      console.error('Error accessing the camera:', error)
      resolve(false)
    }
  })
}
