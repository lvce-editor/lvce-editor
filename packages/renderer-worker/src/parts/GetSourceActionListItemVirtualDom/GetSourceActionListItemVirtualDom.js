import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as EditorStrings from '../EditorStrings/EditorStrings.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getSourceActionListItemVirtualDom = (sourceAction) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'SourceActionHeading',
      childCount: 1,
    },
    text(EditorStrings.sourceAction()),
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
