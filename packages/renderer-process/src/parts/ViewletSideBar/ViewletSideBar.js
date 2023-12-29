import * as AriaRoleDescriptionType from '../AriaRoleDescriptionType/AriaRoleDescriptionType.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Assert from '../Assert/Assert.js'
import * as AttachEvents from '../AttachEvents/AttachEvents.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
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

export const setActionsDom = (state, actions) => {
  const { $SideBarTitleArea, $Actions } = state
  const $NewActions = VirtualDom.render(actions).firstChild
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
