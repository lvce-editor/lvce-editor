import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getActionClassName = (isFocused) => {
  if (isFocused) {
    return MergeClassNames.mergeClassNames(ClassNames.SourceActionItem, ClassNames.SourceActionItemFocused)
  }
  return ClassNames.SourceActionItem
}

export const getSourceActionListItemVirtualDom = (sourceAction) => {
  const { name, isFocused } = sourceAction
  const actionClassName = getActionClassName(isFocused)
  return [
    {
      type: VirtualDomElements.Div,
      className: actionClassName,
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      className: 'SourceActionIcon MaskIcon MaskIconSymbolFile',
    },
    text(name),
  ]
}
