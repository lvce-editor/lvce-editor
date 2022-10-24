import * as Assert from '../Assert/Assert.js'
import * as ViewletDebugEvents from './ViewletRunAndDebugEvents.js'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet RunAndDebug'
  $Viewlet.textContent = 'run and debug (not implemented)'
  $Viewlet.tabIndex = 0
  $Viewlet.onmousedown = ViewletDebugEvents.handleMousedown
  return {
    $Viewlet,
  }
}

export const refresh = (state, message) => {
  Assert.object(state)
  Assert.string(message)
  state.$Viewlet.textContent = 'Run And Debug - Not implemented'
}

export const focus = (state) => {
  const { $Viewlet } = state
  $Viewlet.focus()
}

export const dispose = () => {}
