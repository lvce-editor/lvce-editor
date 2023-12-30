import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getFileIconVirtualDom = (icon) => {
  return {
    type: VirtualDomElements.Img,
    className: ClassNames.FileIcon,
    src: icon,
    childCount: 0,
  }
}
