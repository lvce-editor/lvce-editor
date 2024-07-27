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
      type: VirtualDomElements.Pre,
      className: 'E2eTestContent',
      childCount: 1,
    },
    text(content),
    {
      type: VirtualDomElements.Div,
      className: 'E2eTestPreview',
      childCount: 0,
    },
  ]
}
