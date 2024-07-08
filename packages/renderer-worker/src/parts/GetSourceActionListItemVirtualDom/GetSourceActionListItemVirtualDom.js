import * as ClassNames from '../ClassNames/ClassNames.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getSourceActionListItemVirtualDom = (sourceAction) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.SourceActionItem,
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      className: 'SourceActionIcon MaskIcon MaskIconSymbolFile',
    },
    text(sourceAction.name),
  ]
}
