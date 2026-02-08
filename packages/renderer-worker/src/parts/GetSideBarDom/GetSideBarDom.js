import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

const getActionsDom = (newState) => {
  const actions = newState.actions || []
  return [
    {
      type: VirtualDomElements.Div,
      className: 'Actions',
      role: 'toolbar',
      childCount: 0,
    },
  ]
}

const getTitleAreaDom = (newState) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'SideBarTitleArea',
      childCount: 2,
    },
    {
      type: VirtualDomElements.H2,
      childCount: 1,
    },
    text(newState.title),
    ...getActionsDom(newState),
  ]
}

export const getSideBarDom = (newState) => {
  const { childUid } = newState
  return [
    {
      type: VirtualDomElements.Div,
      className: 'SideBar',
      childCount: 2,
    },
    ...getTitleAreaDom(newState),
    {
      type: VirtualDomElements.Reference,
      uid: childUid,
    },
  ]
}
