export const name = 'KeyBindings'

export const create = () => {
  const $InputBox = document.createElement('input')
  $InputBox.type = 'search'
  $InputBox.placeholder = 'Search Key Bindings'

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet'
  $Viewlet.dataset.viewletId = 'KeyBindings'

  $Viewlet.textContent = 'TODO: implement keybindings editor'

  return {
    $Viewlet,
    $InputBox,
  }
}
