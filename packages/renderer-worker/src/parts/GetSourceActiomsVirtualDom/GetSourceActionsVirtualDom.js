import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getSourceActionVirtualDom = (sourceAction) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'SourceActionItem',
      childCount: 1,
    },
    text(sourceAction.name),
  ]
}

export const getSourceActionsVirtualDom = (sourceActions) => {
  const dom = [...sourceActions.flatMap(getSourceActionVirtualDom)]
  return dom
}
