import * as AriaRoleDescriptionType from '../AriaRoleDescriptionType/AriaRoleDescriptionType.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Assert from '../Assert/Assert.js'
import * as AttachEvents from '../AttachEvents/AttachEvents.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as Viewlet from '../Viewlet/Viewlet.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletSideBarEvents from './ViewletSideBarEvents.js'

export const create = () => {
  const $SideBarTitleAreaTitle = document.createElement('h2')
  $SideBarTitleAreaTitle.className = 'SideBarTitleAreaTitle'

  const $SideBarTitleArea = document.createElement('div')
  $SideBarTitleArea.className = 'SideBarTitleArea'
  $SideBarTitleArea.append($SideBarTitleAreaTitle)

  const $Viewlet = document.createElement('div')
  $Viewlet.id = 'SideBar'
  $Viewlet.className = 'Viewlet SideBar'
  $Viewlet.role = AriaRoles.Complementary
  $Viewlet.ariaRoleDescription = AriaRoleDescriptionType.SideBar
  $Viewlet.append($SideBarTitleArea)

  return {
    $Viewlet,
    $SideBar: $Viewlet,
    $SideBarTitleArea,
    $SideBarContent: undefined,
    $SideBarTitleAreaTitle,
    $Actions: undefined,
  }
}

export const attachEvents = (state) => {
  const { $SideBarTitleArea } = state
  AttachEvents.attachEvents($SideBarTitleArea, {
    [DomEventType.Click]: ViewletSideBarEvents.handleHeaderClick,
  })
}

export const dispose = (state) => {
  Assert.object(state)
  state.$SideBar.replaceChildren()
}

export const setTitle = (state, name) => {
  const { $SideBarTitleAreaTitle } = state
  $SideBarTitleAreaTitle.title = name
  $SideBarTitleAreaTitle.textContent = name
}

export const setActionsDom = async (state, moduleId, actions) => {
  // TODO remove workaround, need to render child view
  // before actions to allow for eventMap being loaded
  await new Promise((resolve) => {
    requestAnimationFrame(resolve)
  })
  const { $SideBarTitleArea, $Actions } = state
  const instance = Object.values(Viewlet.state.instances).find((instance) => instance.factory === Viewlet.state.modules[moduleId])
  if (!instance) {
    console.warn('actions renderer not found')
    return
  }
  const $NewActions = VirtualDom.render(actions, instance.factory.EventMap).firstChild
  if ($Actions) {
    $Actions.replaceWith($NewActions)
  } else {
    $SideBarTitleArea.append($NewActions)
  }
  state.$Actions = $NewActions
}

export const focus = async () => {
  // await
}
