import * as GetAudioVirtualDom from '../GetAudioVirtualDom/GetAudioVirtualDom.js'

export const hasFunctionalRender = true

const renderAudio = {
  isEqual(oldState, newState) {
    return oldState.src === newState.src && oldState.audioErrorMessage === newState.audioErrorMessage
  },
  apply(oldState, newState) {
    const dom = GetAudioVirtualDom.getAudioVirtualDom(newState.src, newState.audioErrorMessage)
    return ['setDom', dom]
  },
}

export const render = [renderAudio]
