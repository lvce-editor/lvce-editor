import * as GetSearchHeaderVirtualDom from '../GetSearchHeaderVirtualDom/GetSearchHeaderVirtualDom.js'
import * as GetSearchResultsVirtualDom from '../GetSearchResultsVirtualDom/GetSearchResultsVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getSearchVirtualDom = (visibleItems, replaceExpanded, matchCase, matchWholeWord, useRegularExpression, message, detailsExpanded) => {
  /**
   * @type {any[]}
   */
  const dom = []
  dom.push(...GetSearchHeaderVirtualDom.getSearchHeaderVirtualDom(replaceExpanded, matchCase, matchWholeWord, useRegularExpression, detailsExpanded))
  dom.push(
    {
      type: VirtualDomElements.Div,
      className: 'ViewletSearchMessage',
      role: AriaRoles.Status,
      tabIndex: 0,
      childCount: 1,
    },
    text(message),
  )
  dom.push({
    type: VirtualDomElements.Div,
    className: 'Viewlet List',
    role: AriaRoles.Tree,
    tabIndex: 0,
    childCount: visibleItems.length,
  })
  dom.push(...GetSearchResultsVirtualDom.getSearchResultsVirtualDom(visibleItems))
  return dom
}
