import * as Assert from '../Assert/Assert.ts'
import * as ScreenCaptureState from '../ScreenCaptureState/ScreenCaptureState.ts'
import { VError } from '../VError/VError.ts'

export const get = (id) => {
  Assert.number(id)
  return ScreenCaptureState.get(id)
}

export const start = async (id, options) => {
  try {
    Assert.number(id)
    Assert.object(options)
    const captureStream = await navigator.mediaDevices.getUserMedia(options)
    ScreenCaptureState.set(id, captureStream)
  } catch (error) {
    throw new VError(error, `Failed to start screen capture`)
  }
}

export const dispose = async (id, options) => {
  try {
    Assert.number(id)
    const captureStream = ScreenCaptureState.get(id)
    for (const track of captureStream.getTracks()) {
      track.stop()
    }
    ScreenCaptureState.remove(id)
  } catch (error) {
    throw new VError(error, `Failed to start screen capture`)
  }
}
