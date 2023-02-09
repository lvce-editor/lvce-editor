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

export const hasFunctionalRender = true

export const renderSrc = {
  isEqual(oldState, newState) {
    return oldState.src === newState.src
  },
  apply(oldState, newState) {
    return [/* method */ 'setSrc', /* src */ newState.src]
  },
}

const renderVideoErrorMessage = {
  isEqual(oldState, newState) {
    return oldState.videoErrorMessage === newState.videoErrorMessage
  },
  apply(oldState, newState) {
    return [/* method */ 'setAudioErrorMessage', /* src */ newState.videoErrorMessage]
  },
}

export const render = [renderSrc, renderVideoErrorMessage]
