import * as AttachEvents from '../AttachEvents/AttachEvents.ts'
import * as DomEventType from '../DomEventType/DomEventType.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.ts'
import * as ViewletTitleBarButtonEvents from './ViewletTitleBarButtonsEvents.ts'

// export const create = () => {
//   const $TitleBarButtons = document.createElement('div')
//   $TitleBarButtons.className = 'Viewlet TitleBarButtons'
//   return {
//     $TitleBarButtons,
//     $Viewlet: $TitleBarButtons,
//   }
// }

// export const attachEvents = (state) => {
//   const { $Viewlet } = state
//   AttachEvents.attachEvents($Viewlet, {
//     [DomEventType.Click]: ViewletTitleBarButtonEvents.handleTitleBarButtonsClick,
//   })
// }

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  VirtualDom.renderInto($Viewlet, dom)
}

export const Events = ViewletTitleBarButtonEvents
