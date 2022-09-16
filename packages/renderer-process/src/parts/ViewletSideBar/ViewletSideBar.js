import * as Layout from '../Layout/Layout.js'
import * as Assert from '../Assert/Assert.js'

export const create = () => {
  const $SideBarTitleAreaTitle = document.createElement('h2')
  $SideBarTitleAreaTitle.id = 'SideBarTitleAreaTitle'

  const $SideBarTitleAreaButtons = document.createElement('div')
  $SideBarTitleAreaButtons.id = 'SideBarTitleAreaButtons'

  const $SideBarTitleArea = document.createElement('div')
  $SideBarTitleArea.id = 'SideBarTitleArea'
  $SideBarTitleArea.append($SideBarTitleAreaTitle, $SideBarTitleAreaButtons)

  // const $SideBarContent = document.createElement('div')
  // $SideBarContent.id = 'SideBarContent'

  const $SideBar = Layout.state.$SideBar
  $SideBar.ariaLabel = 'Side Bar'
  $SideBar.append($SideBarTitleArea)

  return {
    $SideBar,
    $SideBarTitleArea,
    $SideBarTitleAreaButtons,
    $SideBarContent: undefined,
    $SideBarTitleAreaTitle,
  }
}

export const dispose = (state) => {
  Assert.object(state)
  state.$SideBar.replaceChildren()
}

export const appendViewlet = (state, name, $Viewlet) => {
  Assert.object(state)
  Assert.string(name)
  const $SideBarTitleAreaTitle = state.$SideBarTitleAreaTitle
  $SideBarTitleAreaTitle.title = name
  $SideBarTitleAreaTitle.textContent = name
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
  console.log('todo focus sidebar')
}
