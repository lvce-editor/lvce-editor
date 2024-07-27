import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getE2eTestVirtualDom = (content: any) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet E2eTest',
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      className: 'SashCorner',
      childCount: 0,
      onPointerDown: 'handleSashCornerPointerDown',
    },
    text(content),
    {
      type: VirtualDomElements.Div,
      className: 'E2eTestPreview',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Div,
      className: 'E2eTestIframeWrapper',
      childCount: 0,
    },
  ]
}
