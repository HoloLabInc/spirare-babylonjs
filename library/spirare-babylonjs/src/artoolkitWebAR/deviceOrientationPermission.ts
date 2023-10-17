interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>
}

interface DeviceMotionEventiOS extends DeviceMotionEvent {
  requestPermission?: () => Promise<'granted' | 'denied'>
}

export const requestOrientationPermission = async (): Promise<boolean> => {
  const orientationRequestPermission = (
    DeviceOrientationEvent as unknown as DeviceOrientationEventiOS
  ).requestPermission
  if (typeof orientationRequestPermission === 'function') {
    const response = await orientationRequestPermission()
    if (response !== 'granted') {
      return false
    }
  }

  const motionRequestPermission = (
    DeviceMotionEvent as unknown as DeviceMotionEventiOS
  ).requestPermission
  if (typeof motionRequestPermission === 'function') {
    const response = await motionRequestPermission()
    if (response !== 'granted') {
      return false
    }
  }

  return true
}
