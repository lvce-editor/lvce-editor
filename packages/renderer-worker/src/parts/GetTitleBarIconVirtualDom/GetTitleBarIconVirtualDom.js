import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getTitleBarIconVirtualDom = (iconSrc) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet TitleBarIcon',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Img,
      className: 'TitleBarIconIcon',
      src: iconSrc,
      alt: '',
      childCount: 0,
    },
  ]
}
