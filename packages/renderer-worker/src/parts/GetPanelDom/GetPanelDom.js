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

export const getPanelDom = (newState) => {
  const { childUid } = newState
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Panel',
      childCount: 2,
    },
    ...getTitleAreaDom(newState),
    {
      type: VirtualDomElements.Reference,
      uid: childUid,
    },
  ]
}
