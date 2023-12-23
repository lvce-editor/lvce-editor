import * as GetVideoVirtualDom from '../GetVideoVirtualDom/GetVideoVirtualDom.js'
import * as RenderMethod from '../RenderMethod/RenderMethod.js'

export const hasFunctionalRender = true

const renderVideo = {
  isEqual(oldState, newState) {
    return oldState.src === newState.src && oldState.videoErrorMessage === newState.videoErrorMessage
  },
  apply(oldState, newState) {
    const dom = GetVideoVirtualDom.getVideoVirtualDom(newState.src, newState.videoErrorMessage)
    return [/* method */ RenderMethod.SetDom, dom]
  },
}

export const render = [renderVideo]
