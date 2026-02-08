import { getPanelTabsVirtualDom } from '../GetPanelTabsVirtualDom/GetPanelTabsVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

const getActionsDom = (newState) => {
  const actions = newState.actionsUid || -1
  if (actions === -1) {
    return [
      {
        type: VirtualDomElements.Div,
        className: 'Actions',
        role: 'toolbar',
        childCount: 0,
      },
    ]
  }
  return [
    {
      type: VirtualDomElements.Reference,
      uid: actions,
    },
  ]
}

export const getPanelDom = (newState) => {
  const { childUid } = newState
  const tabsDom = getPanelTabsVirtualDom(newState.views, newState.selectedIndex, newState.badgeCounts)
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Panel',
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      className: 'PanelHeader',
      childCount: 2,
    },
    {
      type: VirtualDomElements.Div,
      className: 'PanelTabs',
      childCount: newState.views.length,
    },
    ...tabsDom,
    ...getActionsDom(newState),
    {
      type: VirtualDomElements.Reference,
      uid: childUid,
    },
  ]
}
