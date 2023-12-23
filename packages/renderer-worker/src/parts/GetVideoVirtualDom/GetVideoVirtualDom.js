import * as GetMediaVirtualDom from '../GetMediaVirtualDom/GetMediaVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getVideoVirtualDom = (src, errorMessage) => {
  return GetMediaVirtualDom.getMediaVirtualDom(VirtualDomElements.Video, src, errorMessage)
}
