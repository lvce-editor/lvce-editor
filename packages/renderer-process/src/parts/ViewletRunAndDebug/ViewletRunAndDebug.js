import * as Assert from '../Assert/Assert.js'
import * as ViewletDebugEvents from './ViewletRunAndDebugEvents.js'

export const create = () => {
  const $ButtonPause = document.createElement('button')
  $ButtonPause.textContent = 'pause'
  $ButtonPause.className = 'DebugButtonPause'

  const $ButtonContinue = document.createElement('button')
  $ButtonContinue.className = 'DebugButtonContinue'
  $ButtonContinue.textContent = 'continue'

  const $Title = document.createElement('div')
  $Title.textContent = 'Threads'

  const $Processes = document.createElement('div')

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet RunAndDebug'
  $Viewlet.tabIndex = 0
  $Viewlet.onmousedown = ViewletDebugEvents.handleMouseDown
  $Viewlet.append($ButtonPause, $ButtonContinue, $Title, $Processes)

  return {
    $Viewlet,
    $Processes,
    $ButtonPause,
    $ButtonContinue,
  }
}

const create$Process = (process) => {
  const $Process = document.createElement('div')
  $Process.textContent = process.title
  return $Process
}

export const setProcesses = (state, processes) => {
  const { $Processes } = state
  $Processes.replaceChildren(...processes.map(create$Process))
}

export const refresh = (state, message) => {
  Assert.object(state)
  Assert.string(message)
}

export const focus = (state) => {
  const { $Viewlet } = state
  $Viewlet.focus()
}

export const dispose = () => {}
