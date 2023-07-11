import * as InputBox from '../InputBox/InputBox.js'

export const create = () => {
  const $DebugConsoleTop = document.createElement('div')
  $DebugConsoleTop.className = 'DebugConsoleTop'

  const $Input = InputBox.create()

  const $DebugConsoleBottom = document.createElement('div')
  $DebugConsoleBottom.className = 'DebugConsoleBottom'
  $DebugConsoleBottom.append($Input)

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet DebugConsole'
  $Viewlet.append($DebugConsoleTop, $DebugConsoleBottom)
  return {
    $Viewlet,
    $DebugConsoleTop,
    $Input,
  }
}

export const focus = (state) => {
  const { $Input } = state
  $Input.focus()
}

export const setText = (state, text) => {
  const { $DebugConsoleTop } = state
  $DebugConsoleTop.textContent = text
}
