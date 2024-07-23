import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getTestDom = (test) => {
  return [
    {
      type: VirtualDomElements.Div,
      childCount: 1,
      className: 'TreeItem',
    },
    text(test),
  ]
}

export const getE2eTestsVirtualDom = (tests) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet E2eTests Tree',
      childCount: tests.length,
      onClick: 'handleClickAt',
    },
    ...tests.flatMap(getTestDom),
  ]
}
