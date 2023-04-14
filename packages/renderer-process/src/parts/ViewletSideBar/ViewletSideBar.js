import * as Actions from '../Actions/Actions.js'
import * as AriaRoleDescriptionType from '../AriaRoleDescriptionType/AriaRoleDescriptionType.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Assert from '../Assert/Assert.js'

export const create = () => {
  const $SideBarTitleAreaTitle = document.createElement('h2')
  $SideBarTitleAreaTitle.className = 'SideBarTitleAreaTitle'

  const $SideBarTitleAreaButtons = document.createElement('div')
  $SideBarTitleAreaButtons.className = 'SideBarTitleAreaButtons'

  const $SideBarTitleArea = document.createElement('div')
  $SideBarTitleArea.className = 'SideBarTitleArea'
  $SideBarTitleArea.append($SideBarTitleAreaTitle, $SideBarTitleAreaButtons)

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
    $SideBarTitleAreaButtons,
    $SideBarContent: undefined,
    $SideBarTitleAreaTitle,
    $Actions: undefined,
  }
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

export const setActions = (state, actions) => {
  const { $SideBarTitleArea, $Actions } = state
  const $NewActions = Actions.create(actions)
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
