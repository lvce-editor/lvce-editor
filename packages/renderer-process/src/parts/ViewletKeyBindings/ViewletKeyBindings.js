export const name = 'KeyBindings'

export const create = () => {
  const $InputBox = document.createElement('input')
  $InputBox.type = 'search'
  $InputBox.placeholder = 'Search Key Bindings'

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet'
  $Viewlet.dataset.viewletId = 'KeyBindings'

  return {
    $Viewlet,
    $InputBox,
  }
}

export const setKeyBindings = (state, keyBindings) => {
  const { $Viewlet } = state
  $Viewlet.textContent = JSON.stringify(keyBindings, null, 2) + '\n'
}
