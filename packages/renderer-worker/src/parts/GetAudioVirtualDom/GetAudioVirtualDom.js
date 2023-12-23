import * as GetMediaVirtualDom from '../GetMediaVirtualDom/GetMediaVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getAudioVirtualDom = (src, errorMessage) => {
  return GetMediaVirtualDom.getMediaVirtualDom(VirtualDomElements.Audio, src, errorMessage)
}
