import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getTreeItemClassName = (isActive) => {
  if (isActive) {
    return 'TreeItem TestActive'
  }
  return 'TreeItem'
}

const getTestDom = (test) => {
  return [
    {
      type: VirtualDomElements.Div,
      childCount: 1,
      className: getTreeItemClassName(test.isActive),
    },
    {
      type: VirtualDomElements.Span,
      className: 'Label',
      childCount: 1,
    },
    text(test.name),
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
