import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const imageContent = {
  type: VirtualDomElements.Div,
  className: ClassNames.ImageContent,
  childCount: 1,
}

export const getImageVirtualDom = (src, errorMessage) => {
  if (errorMessage) {
    return [
      imageContent,
      {
        type: VirtualDomElements.Div,
        className: ClassNames.ImageErrorMessage,
        childCount: 1,
      },
      text(errorMessage),
    ]
  }
  const dom = [
    imageContent,
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
