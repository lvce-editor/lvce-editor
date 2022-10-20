export const name = 'Debug Console'

export const create = () => {
  const $Input = document.createElement('input')
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet DebugConsole'
  $Viewlet.textContent = 'Debug Console'
  $Viewlet.append($Input)
  return {
    $Viewlet,
    $Input,
  }
}

export const refresh = (state, context) => {
  const { $Viewlet } = state
  $Viewlet.textContent = 'Debug Console - Not implemented'
}

export const focus = (state) => {
  const { $Input } = state
  $Input.focus()
}

export const dispose = (state) => {}
