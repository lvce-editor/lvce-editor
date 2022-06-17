export const name = 'Debug Console'

export const create = () => {
  const $Input = document.createElement('input')
  const $Viewlet = document.createElement('div')
  $Viewlet.dataset.viewletId = 'DebugConsole'
  $Viewlet.className = 'Viewlet'
  $Viewlet.textContent = 'Debug Console'
  $Viewlet.append($Input)
  return {
    $Viewlet,
    $Input,
  }
}

export const refresh = (state, context) => {
  state.$Viewlet.textContent = 'Debug Console - Not implemented'
}

export const focus = (state) => {
  state.$Input.focus()
}

export const dispose = (state) => {}
