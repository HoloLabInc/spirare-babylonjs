export const startCameraStream = async (
  videoElement: HTMLVideoElement,
  constraints: MediaStreamConstraints
): Promise<boolean> => {
  return new Promise(async (resolve) => {
    /*
    const constraints = {
      video: {
        // facingMode: { exact: 'environment' },
        facingMode: 'environment',
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    }
	*/

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
