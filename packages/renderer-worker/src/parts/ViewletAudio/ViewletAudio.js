import * as BlobSrc from '../BlobSrc/BlobSrc.js'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.js'

export const create = (id, uri) => {
  return {
    uri,
    src: '',
    audioErrorMessage: '',
  }
}

export const loadContent = async (state) => {
  // TODO get src from uri
  const { uri } = state
  const src = await BlobSrc.getSrc(uri)
  return {
    ...state,
    src,
  }
}

const getImprovedErrorMessage = (message) => {
  return `Failed to load audio: ${message}`
}

export const handleAudioError = (state, code, message) => {
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
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ ViewletModuleId.Audio,
      /* method */ 'setSrc',
      /* src */ newState.src,
    ]
  },
}

const renderAudioErrorMessage = {
  isEqual(oldState, newState) {
    return oldState.audioErrorMessage === newState.audioErrorMessage
  },
  apply(oldState, newState) {
    return [
      /* Viewlet.send */ 'Viewlet.send',
      /* id */ ViewletModuleId.Audio,
      /* method */ 'setAudioErrorMessage',
      /* src */ newState.audioErrorMessage,
    ]
  },
}

export const render = [renderSrc, renderAudioErrorMessage]
