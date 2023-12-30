import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getMediaVirtualDom = (element, src, errorMessage) => {
  if (errorMessage) {
    return [
      {
        type: VirtualDomElements.Div,
        className: ClassNames.MediaContent,
        childCount: 1,
      },
      {
        type: VirtualDomElements.Div,
        className: ClassNames.MediaErrorMessage,
        childCount: 1,
      },
      text(errorMessage),
    ]
  }
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.MediaContent,
      childCount: 1,
    },
    {
      type: element,
      className: ClassNames.MediaElement,
      src,
      controls: true,
      childCount: 0,
    },
  ]
  return dom
}
