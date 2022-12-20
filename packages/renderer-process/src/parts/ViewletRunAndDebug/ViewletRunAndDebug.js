import * as Assert from '../Assert/Assert.js'
import * as ViewletDebugEvents from './ViewletRunAndDebugEvents.js'

export const create = () => {
  // const $ButtonPause = document.createElement('button')
  // $ButtonPause.textContent = 'pause'
  // $ButtonPause.className = 'DebugButtonPause'

  const $ButtonPauseContinue = document.createElement('button')
  $ButtonPauseContinue.className = 'DebugButtonPauseContinue'
  // $ButtonPauseContinue.textContent = 'continue'

  const $Title = document.createElement('div')
  $Title.textContent = 'Threads'

  const $Processes = document.createElement('div')

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet RunAndDebug'
  $Viewlet.tabIndex = 0
  $Viewlet.onmousedown = ViewletDebugEvents.handleMouseDown
  $Viewlet.append($ButtonPauseContinue, $Title, $Processes)

  return {
    $Viewlet,
    $Processes,
    $ButtonPauseContinue,
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

export const setDebugState = (state, debugState) => {
  const { $ButtonPauseContinue } = state
  switch (debugState) {
    case 'paused':
      $ButtonPauseContinue.textContent = 'continue'
      break
    case 'default':
      $ButtonPauseContinue.textContent = 'pause'
      break
    default:
      break
  }
  console.log({ debugState })
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
