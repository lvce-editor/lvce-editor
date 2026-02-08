import { getPanelTabsVirtualDom } from '../GetPanelTabsVirtualDom/GetPanelTabsVirtualDom.js'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import * as DomEventListenerFunctions from '../DomEventListenerFunctions/DomEventListenerFunctions.js'

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

const getGlobalActionsDom = (newState) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'PanelToolBar',
      role: 'toolbar',
      childCount: 2,
    },
    {
      type: VirtualDomElements.Button,
      childCount: 1,
      className: 'IconButton',
      titleM: 'Maximize',
      ariaLabel: 'Maximize',
      onClick: DomEventListenerFunctions.HandleClickMaximize,
    },
    {
      type: VirtualDomElements.Div,
      childCount: 0,
      className: 'MaskIcon MaskIconChevronUp',
    },
    {
      type: VirtualDomElements.Button,
      childCount: 1,
      className: 'IconButton',
      titleM: 'Close',
      ariaLabel: 'Close',
      onClick: DomEventListenerFunctions.HandleClickClose,
    },
    {
      type: VirtualDomElements.Div,
      childCount: 0,
      className: 'MaskIcon MaskIconClose',
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
      childCount: 3,
    },
    {
      type: VirtualDomElements.Div,
      className: 'PanelTabs',
      childCount: newState.views.length,
    },
    ...tabsDom,
    ...getActionsDom(newState),
    ...getGlobalActionsDom(newState),
    {
      type: VirtualDomElements.Reference,
      uid: childUid,
    },
  ]
}
