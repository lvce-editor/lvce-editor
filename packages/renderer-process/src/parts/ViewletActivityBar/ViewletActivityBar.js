import * as Layout from '../Layout/Layout.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletActivityBarEvents from './ViewletActivityBarEvents.js'

// TODO set aria-selected false when sidebar is collapsed

export const name = 'ActivityBar'

export const create = () => {
  const $ActivityBar = Layout.state.$ActivityBar
  $ActivityBar.role = 'toolbar'
  $ActivityBar.ariaLabel = 'Activity Bar'
  $ActivityBar.ariaOrientation = 'vertical'
  // $ActivityBar.append(...activityBarItems.map(create$ActivityBarItem))
  $ActivityBar.onmousedown = ViewletActivityBarEvents.handleMousedown
  $ActivityBar.oncontextmenu = ViewletActivityBarEvents.handleContextMenu
  $ActivityBar.onblur = ViewletActivityBarEvents.handleBlur
  $ActivityBar.addEventListener(
    'focusin',
    ViewletActivityBarEvents.handleFocusIn
  )
  return {
    $ActivityBar,
  }
}

export const dispose = (state) => {}

export const setDom = (state, dom) => {
  const { $ActivityBar } = state
  // console.log(dom)
  const $Root = VirtualDom.render(dom)
  // console.log($Root)
  // @ts-ignore
  $ActivityBar.replaceChildren(...$Root.firstChild.children)
}
