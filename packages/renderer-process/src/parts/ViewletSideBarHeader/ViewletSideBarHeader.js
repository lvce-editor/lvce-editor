export const create = () => {
  const $SideBarTitleAreaTitle = document.createElement('h2')
  $SideBarTitleAreaTitle.id = 'SideBarTitleAreaTitle'

  const $SideBarTitleAreaButtons = document.createElement('div')
  $SideBarTitleAreaButtons.id = 'SideBarTitleAreaButtons'

  const $Viewlet = document.createElement('div')
  $Viewlet.id = 'SideBarTitleArea'
  $Viewlet.className = 'Viewlet SideBarTitleArea'
  $Viewlet.append($SideBarTitleAreaTitle, $SideBarTitleAreaButtons)

  return {
    $Viewlet,
    $SideBarTitleArea: $Viewlet,
    $SideBarTitleAreaButtons,
    $SideBarTitleAreaTitle,
  }
}

export const setTitle = (state, name) => {
  const { $SideBarTitleAreaTitle } = state
  $SideBarTitleAreaTitle.title = name
  $SideBarTitleAreaTitle.textContent = name
}

export const setButtons = () => {
  // TODO
}
