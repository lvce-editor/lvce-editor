import * as ClassNames from '../ClassNames/ClassNames.js'
import * as EditorStrings from '../EditorStrings/EditorStrings.js'
import * as GetSourceActionListItemVirtualDom from '../GetSourceActionListItemVirtualDom/GetSourceActionListItemVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getSourceActionsVirtualDom = (sourceActions) => {
  const dom = [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet EditorSourceActions',
      tabIndex: -1,
      childCount: 2,
      onFocusIn: 'handleFocusIn',
    },
    {
      type: VirtualDomElements.Div,
      className: ClassNames.SourceActionHeading,
      childCount: 1,
    },
    text(EditorStrings.sourceAction()),
    {
      type: VirtualDomElements.Div,
      className: 'EditorSourceActionsList',
      childCount: sourceActions.length,
    },
    ...sourceActions.flatMap(GetSourceActionListItemVirtualDom.getSourceActionListItemVirtualDom),
  ]
  return dom
}
