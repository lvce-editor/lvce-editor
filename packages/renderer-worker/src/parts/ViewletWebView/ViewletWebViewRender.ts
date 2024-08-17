import * as GetAudioVirtualDom from '../GetAudioVirtualDom/GetAudioVirtualDom.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderAudio = {
  isEqual(oldState, newState) {
    return oldState.iframeSrc === newState.iframeSrc
  },
  apply(oldState, newState) {
    const dom = GetAudioVirtualDom.getAudioVirtualDom('https://example.com/audio.mp3', '')
    return ['Viewlet.setDom2', dom]
  },
}

export const render = [renderAudio]
