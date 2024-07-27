import * as ClassNames from '../ClassNames/ClassNames.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getTreeItemClassName = (isActive: boolean) => {
  if (isActive) {
    return MergeClassNames.mergeClassNames(ClassNames.TreeItem, ClassNames.TestActive)
  }
  return ClassNames.TreeItem
}

const getIconClass = (isActive) => {
  if (isActive) {
    return ClassNames.MaskIconDebugPause
  }
  return ClassNames.MaskIconPlay
}

const getTestDom = (test: any) => {
  const { name, isActive } = test
  const dom: any[] = []
  const iconClass = getIconClass(isActive)
  dom.push(
    {
      type: VirtualDomElements.Div,
      childCount: 2,
      className: getTreeItemClassName(isActive),
    },
    {
      type: VirtualDomElements.Button,
      childCount: 1,
      className: 'InlineButton',
      ariaLabel: 'Pause',
    },
    {
      type: VirtualDomElements.I,
      className: MergeClassNames.mergeClassNames(ClassNames.MaskIcon, iconClass),
      childCount: 0,
    },
    {
      type: VirtualDomElements.Span,
      className: ClassNames.Label,
      childCount: 1,
    },
    text(name),
  )
  return dom
}

export const getE2eTestsVirtualDom = (tests: any[]) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet E2eTests Tree',
      childCount: tests.length,
      onClick: DomEventListenerFunctions.HandleClickAt,
    },
    ...tests.flatMap(getTestDom),
  ]
}
