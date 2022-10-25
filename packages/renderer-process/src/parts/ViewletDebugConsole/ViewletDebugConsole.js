import * as InputBox from '../InputBox/InputBox.js'

export const name = 'Debug Console'

export const create = () => {
  const $DebugConsoleTop = document.createElement('div')
  $DebugConsoleTop.className = 'DebugConsoleTop'
  $DebugConsoleTop.textContent = 'Debug Console (not implemented)'

  const $Input = InputBox.create()

  const $DebugConsoleBottom = document.createElement('div')
  $DebugConsoleBottom.className = 'DebugConsoleBottom'
  $DebugConsoleBottom.append($Input)

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet DebugConsole'
  $Viewlet.append($DebugConsoleTop, $DebugConsoleBottom)
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
