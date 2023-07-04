import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getVideoVirtualDom = (src, errorMessage) => {
  if (errorMessage) {
    return [
      {
        type: VirtualDomElements.Div,
        className: 'VideoContent',
        childCount: 1,
      },
      {
        type: VirtualDomElements.Div,
        className: 'VideoErrorMessage',
        childCount: 1,
      },
      text(errorMessage),
    ]
  }
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'VideoContent',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: 'VideoVideo',
      src,
      controls: true,
      childCount: 0,
    },
  ]
  return dom
}
