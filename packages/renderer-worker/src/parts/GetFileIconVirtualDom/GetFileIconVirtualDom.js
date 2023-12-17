import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getFileIconVirtualDom = (icon) => {
  return {
    type: VirtualDomElements.Img,
    className: 'FileIcon',
    src: icon,
    childCount: 0,
  }
}
