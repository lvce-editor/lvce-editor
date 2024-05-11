import * as CreateScreenCaptureStream from '../CreateScreenCaptureStream/CreateScreenCaptureStream.js'
import * as Id from '../Id/Id.js'
import * as MediaDevices from '../MediaDevices/MediaDevices.js'

export const create = (id, uri) => {
  return {
    id,
    uid: id,
    message: '',
    captureId: 0,
  }
}

export const loadContent = async (state) => {
  const captureId = Id.create()
  await CreateScreenCaptureStream.createScreenCaptureStream(captureId)
  return {
    ...state,
    captureId,
  }
}

export const dispose = async (state) => {
  // TODO race condition
  const { captureId } = state
  await MediaDevices.dispose(captureId)
}
