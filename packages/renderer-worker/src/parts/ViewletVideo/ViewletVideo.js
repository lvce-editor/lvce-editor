import * as BlobSrc from '../BlobSrc/BlobSrc.js'
import * as I18nString from '../I18NString/I18NString.js'

/**
 * @enum {string}
 */
const UiStrings = {
  FailedToLoadVideo: `Failed to load video: {PH1}`,
}

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
  return I18nString.i18nString(UiStrings.FailedToLoadVideo, {
    PH1: message,
  })
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
