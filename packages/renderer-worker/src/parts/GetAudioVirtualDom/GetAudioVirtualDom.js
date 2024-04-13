import * as GetMediaVirtualDom from '../GetMediaVirtualDom/GetMediaVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'

export const getAudioVirtualDom = (src, errorMessage) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet Media Audio',
      childCount: 1,
      onError: DomEventListenerFunctions.HandleAudioError,
    },
    ...GetMediaVirtualDom.getMediaVirtualDom(VirtualDomElements.Audio, src, errorMessage),
  ]
}
