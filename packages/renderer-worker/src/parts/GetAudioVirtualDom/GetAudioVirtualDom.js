import * as GetMediaVirtualDom from '../GetMediaVirtualDom/GetMediaVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getAudioVirtualDom = (src, errorMessage) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet Media Audio',
      childCount: 1,
      onError: 'handleAudioError',
    },
    ...GetMediaVirtualDom.getMediaVirtualDom(VirtualDomElements.Audio, src, errorMessage),
  ]
}
