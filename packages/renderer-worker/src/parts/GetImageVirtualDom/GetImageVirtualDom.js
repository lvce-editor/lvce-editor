import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getImageVirtualDom = (src, errorMessage) => {
  if (errorMessage) {
    return [
      {
        type: VirtualDomElements.Div,
        className: 'ImageContent',
        childCount: 1,
      },
      {
        type: VirtualDomElements.Div,
        className: 'ImageErrorMessage',
        childCount: 1,
      },
      text(errorMessage),
    ]
  }
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'ImageContent',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Img,
      className: 'ImageElement',
      src,
      draggable: false,
      childCount: 0,
    },
  ]
  return dom
}
