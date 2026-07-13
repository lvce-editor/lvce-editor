import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

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

const getTitleAreaDom = (newState) => {
  const title = newState.title || newState.currentViewletId
  return [
    {
      type: VirtualDomElements.Div,
      className: 'SideBarTitleArea',
      childCount: 2,
    },
    {
      type: VirtualDomElements.H2,
      childCount: 1,
      className: 'SideBarTitleAreaTitle',
    },
    text(title),
    ...getActionsDom(newState),
  ]
}

export const getSideBarDom = (newState) => {
  const { childUid } = newState
  const showHeader = newState.titleAreaHeight !== 0
  return [
    {
      type: VirtualDomElements.Div,
      className: 'SideBar',
      childCount: showHeader ? 2 : 1,
    },
    ...(showHeader ? getTitleAreaDom(newState) : []),
    {
      type: VirtualDomElements.Reference,
      uid: childUid,
    },
  ]
}
