import * as BlobSrc from '../BlobSrc/BlobSrc.js'
import * as ViewletVideoStrings from './ViewletVideoStrings.js'

export const create = (id, uri) => {
  return {
    uri,
    src: '',
    errorMessage: '',
  }
}

export const loadContent = async (state) => {
  const { uri } = state
  const src = await BlobSrc.getSrc(uri)
  return {
    ...state,
    src,
  }
}

const getImprovedErrorMessage = (message) => {
  return ViewletVideoStrings.failedToLoadVideo(message)
}

export const handleVideoError = (state, code, message) => {
  const improvedMessage = getImprovedErrorMessage(message)
  return {
    ...state,
    audioErrorMessage: improvedMessage,
  }
}

export const dispose = async (state) => {
  const { src } = state
  await BlobSrc.disposeSrc(src)
  return state
}
