import * as GetProblemsItemsVirtualDom from '../GetProblemsItemsVirtualDom/GetProblemsItemsVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getProblemsVirtualDom = (viewMode, problems, filterValue) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Viewlet Problems',
      tabIndex: 0,
      onPointerDown: 'handlePointerDown',
      onContextMenu: 'handleContextMenu',
      childCount: 1,
    },
    ...GetProblemsItemsVirtualDom.getProblemsVirtualDom(viewMode, problems, filterValue),
  ]
}
