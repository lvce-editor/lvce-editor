import { VError } from '../VError/VError.js'
import * as Assert from '../Assert/Assert.js'

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
