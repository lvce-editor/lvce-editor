import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getSourceActionVirtualDom = (sourceAction) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'SourceActionHeading',
      childCount: 1,
    },
    text('Source Action'),
    {
      type: VirtualDomElements.Div,
      className: 'SourceActionItem',
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      className: 'SourceActionIcon MaskIcon MaskIconSymbolFile',
    },
    text(sourceAction.name),
  ]
}

export const getSourceActionsVirtualDom = (sourceActions) => {
  const dom = sourceActions.flatMap(getSourceActionVirtualDom)
  return dom
}
