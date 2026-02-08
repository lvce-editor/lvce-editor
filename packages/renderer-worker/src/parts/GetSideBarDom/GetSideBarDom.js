import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'

export const getSideBarDom = (newState) => {
  const { childUid } = newState
  return [
    {
      type: VirtualDomElements.Div,
      className: 'SideBar',
      childCount: 1,
    },
    {
      type: VirtualDomElements.Reference,
      uid: childUid,
    },
  ]
}
