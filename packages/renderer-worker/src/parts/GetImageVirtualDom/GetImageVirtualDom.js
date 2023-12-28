import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getImageVirtualDom = (src, errorMessage) => {
  if (errorMessage) {
    return [
      {
        type: VirtualDomElements.Div,
        className: ClassNames.ImageContent,
        childCount: 1,
      },
      {
        type: VirtualDomElements.Div,
        className: ClassNames.ImageErrorMessage,
        childCount: 1,
      },
      text(errorMessage),
    ]
  }
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ImageContent,
      childCount: 1,
    },
    {
      type: VirtualDomElements.Img,
      className: ClassNames.ImageElement,
      src,
      draggable: false,
      childCount: 0,
    },
  ]
  return dom
}
