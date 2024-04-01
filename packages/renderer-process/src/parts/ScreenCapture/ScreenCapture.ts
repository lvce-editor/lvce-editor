import { VError } from '../VError/VError.ts'
import * as Assert from '../Assert/Assert.ts'

export const state = {
  screenCaptures: Object.create(null),
}

export const get = (id) => {
  Assert.number(id)
  return state.screenCaptures[id]
}

export const start = async (id, options) => {
  try {
    Assert.number(id)
    Assert.object(options)
    const captureStream = await navigator.mediaDevices.getUserMedia(options)
    state.screenCaptures[id] = captureStream
  } catch (error) {
    throw new VError(error, `Failed to start screen capture`)
  }
}

export const dispose = async (id, options) => {
  try {
    Assert.number(id)
    const captureStream = await state.screenCaptures[id]
    for (const track of captureStream.getTracks()) {
      track.stop()
    }
    delete state.screenCaptures[id]
  } catch (error) {
    throw new VError(error, `Failed to start screen capture`)
  }
}
