import * as GetVideoVirtualDom from '../GetVideoVirtualDom/GetVideoVirtualDom.js'

export const hasFunctionalRender = true

export const hasFunctionalRootRender = true

const renderVideo = {
  isEqual(oldState, newState) {
    return oldState.src === newState.src && oldState.videoErrorMessage === newState.videoErrorMessage
  },
  apply(oldState, newState) {
    const dom = GetVideoVirtualDom.getVideoVirtualDom(newState.src, newState.videoErrorMessage)
    return ['Viewlet.setDom2', dom]
  },
}

export const render = [renderVideo]
