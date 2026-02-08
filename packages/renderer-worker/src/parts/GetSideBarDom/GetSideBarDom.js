import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.js'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.js'

export const getSideBarDom = (tab) => {
  return [
    {
      type: VirtualDomElements.Div,
      className: 'SideBar',
      childCount: 1,
    },
    text('SideBar'),
  ]
}
