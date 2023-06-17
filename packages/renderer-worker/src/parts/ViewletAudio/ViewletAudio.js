import * as AudioDisplay from '../AudioDisplay/AudioDisplay.js'
import * as BlobSrc from '../BlobSrc/BlobSrc.js'

export const create = (id, uri) => {
  return {
    uri,
    src: '',
    audioErrorMessage: '',
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

export const handleAudioError = (state, code, message) => {
  const improvedMessage = AudioDisplay.getImprovedErrorMessage(message)
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
