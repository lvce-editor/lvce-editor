import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Assert from '../Assert/Assert.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.id = 'SideBar'
  $Viewlet.className = 'Viewlet SideBar'
  // @ts-ignore
  $Viewlet.role = AriaRoles.Complementary
  $Viewlet.ariaRoleDescription = 'Side Bar'

  return {
    $Viewlet,
    $SideBar: $Viewlet,
    $SideBarContent: undefined,
  }
}

export const dispose = (state) => {
  Assert.object(state)
  state.$SideBar.replaceChildren()
}

export const appendViewlet = (state, name, $Viewlet) => {
  Assert.object(state)
  Assert.string(name)
  // const $SideBarTitleAreaTitle = state.$SideBarTitleAreaTitle
  // $SideBarTitleAreaTitle.title = name
  // $SideBarTitleAreaTitle.textContent = name
  // TODO is it a problem that the id is duplicated for a short amount of time here?
  $Viewlet.id = 'SideBarContent'
  if (state.$SideBarContent) {
    state.$SideBarContent.replaceWith($Viewlet)
  } else {
    state.$SideBar.append($Viewlet)
  }
  state.$SideBarContent = $Viewlet
}

export const focus = async () => {
  // await
}
