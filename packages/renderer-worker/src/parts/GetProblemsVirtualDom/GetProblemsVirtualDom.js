import * as ActionType from '../ActionType/ActionType.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'
import * as GetProblemsItemsVirtualDom from '../GetProblemsItemsVirtualDom/GetProblemsItemsVirtualDom.js'
import * as ProblemStrings from '../ProblemStrings/ProblemStrings.js'
import * as GetProblemsFilterVirtualDom from '../GetProblemsFilterVirtualDom/GetProblemsFilterVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getProblemsVirtualDom = (viewMode, problems, filterValue, isSmall) => {
  const dom = []

  dom.push({
    type: VirtualDomElements.Div,
    className: 'Viewlet Problems',
    tabIndex: 0,
    onPointerDown: DomEventListenerFunctions.HandlePointerDown,
    onContextMenu: DomEventListenerFunctions.HandleContextMenu,
    childCount: 1,
  })
  if (isSmall) {
    dom[0].childCount++
    dom.push(
      ...GetProblemsFilterVirtualDom.getProblemsFilterVirtualDom({
        type: ActionType.ProblemsFilter,
        id: 'Filter',
        command: DomEventListenerFunctions.HandleFilterInput,
        badgeText: '',
        placeholder: ProblemStrings.filter(),
        value: '',
      }),
    )
  }
  dom.push(...GetProblemsItemsVirtualDom.getProblemsVirtualDom(viewMode, problems, filterValue))
  return dom
}
