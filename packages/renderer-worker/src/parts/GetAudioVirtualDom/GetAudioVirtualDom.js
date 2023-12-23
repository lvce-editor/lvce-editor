import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getAudioVirtualDom = (src, errorMessage) => {
  if (errorMessage) {
    return [
      {
        type: VirtualDomElements.Div,
        className: 'AudioContent',
        childCount: 1,
      },
      {
        type: VirtualDomElements.Div,
        className: 'AudioErrorMessage',
        childCount: 1,
      },
      text(errorMessage),
    ]
  }
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'AudioContent',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Audio,
      className: 'AudioElement',
      src,
      controls: true,
      childCount: 0,
    },
  ]
  return dom
}
