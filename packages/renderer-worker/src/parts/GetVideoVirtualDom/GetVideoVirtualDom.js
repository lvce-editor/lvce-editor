// based on the video editor by vscode

import * as GetMediaVirtualDom from '../GetMediaVirtualDom/GetMediaVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getVideoVirtualDom = (src, errorMessage) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet Media Video',
      childCount: 1,
      onError: 'handleVideoError',
    },
    ...GetMediaVirtualDom.getMediaVirtualDom(VirtualDomElements.Video, src, errorMessage),
  ]
}
