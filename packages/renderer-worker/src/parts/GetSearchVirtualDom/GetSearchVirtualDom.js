import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as ClassNames from '../ClassNames/ClassNames.js'
import * as GetSearchHeaderVirtualDom from '../GetSearchHeaderVirtualDom/GetSearchHeaderVirtualDom.js'
import * as GetSearchResultsVirtualDom from '../GetSearchResultsVirtualDom/GetSearchResultsVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getSearchVirtualDom = (
  visibleItems,
  replaceExpanded,
  matchCase,
  matchWholeWord,
  useRegularExpression,
  message,
  detailsExpanded,
  focusOutline,
) => {
  /**
   * @type {any[]}
   */
  const dom = []
  dom.push({
    type: VirtualDomElements.Div,
    className: MergeClassNames.mergeClassNames(ClassNames.Viewlet, ClassNames.Search),
    childCount: 2,
  })
  dom.push(...GetSearchHeaderVirtualDom.getSearchHeaderVirtualDom(replaceExpanded, matchCase, matchWholeWord, useRegularExpression, detailsExpanded))
  dom.push(
    {
      type: VirtualDomElements.Div,
      className: ClassNames.ViewletSearchMessage,
      role: AriaRoles.Status,
      tabIndex: 0,
      childCount: 1,
    },
    text(message),
  )
  dom.push({
    type: VirtualDomElements.Div,
    className: MergeClassNames.mergeClassNames(ClassNames.Viewlet, ClassNames.List, focusOutline ? ClassNames.FocusOutline : ClassNames.Empty),
    role: AriaRoles.Tree,
    tabIndex: 0,
    childCount: visibleItems.length,
    onClick: DomEventListenerFunctions.HandleClick,
  })
  dom.push(...GetSearchResultsVirtualDom.getSearchResultsVirtualDom(visibleItems))
  return dom
}
