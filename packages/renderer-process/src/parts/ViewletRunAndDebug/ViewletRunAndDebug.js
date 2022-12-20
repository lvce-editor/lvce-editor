import * as Assert from '../Assert/Assert.js'
import * as ViewletDebugEvents from './ViewletRunAndDebugEvents.js'
import * as MaskIcon from '../MaskIcon/MaskIcon.js'
import * as Icon from '../Icon/Icon.js'

const create$DebugButton = (text) => {
  const $Button = document.createElement('button')
  $Button.className = 'DebugButton'
  $Button.textContent = text
  return $Button
}

const create$DebugSectionHeader = (text) => {
  const $DebugSectionHeader = document.createElement('div')
  $DebugSectionHeader.className = 'DebugSectionHeader'
  const $Icon = MaskIcon.create(Icon.TriangleRight)
  $Icon.classList.add('DebugMaskIcon')
  const $Label = document.createTextNode(text)
  $DebugSectionHeader.append($Icon, $Label)
  return $DebugSectionHeader
}

export const create = () => {
  // const $ButtonPause = document.createElement('button')
  // $ButtonPause.textContent = 'pause'
  // $ButtonPause.className = 'DebugButtonPause'

  const $ButtonPauseContinue = create$DebugButton('')

  const $ButtonStepOver = create$DebugButton('Step over')

  const $ButtonStepInto = create$DebugButton('Step into')

  const $ButtonStepOut = create$DebugButton('Step out')

  const $Processes = document.createElement('div')

  const $DebugSectionHeaderWatch = create$DebugSectionHeader('Watch')
  const $DebugSectionHeaderBreakPoints =
    create$DebugSectionHeader('Breakpoints')
  const $DebugSectionHeaderScope = create$DebugSectionHeader('Scope')
  const $DebugSectionHeaderCallstack = create$DebugSectionHeader('Call Stack')

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet RunAndDebug'
  $Viewlet.tabIndex = 0
  $Viewlet.onmousedown = ViewletDebugEvents.handleMouseDown
  $Viewlet.append(
    $ButtonPauseContinue,
    $ButtonStepOver,
    $ButtonStepInto,
    $ButtonStepOut,
    $DebugSectionHeaderWatch,
    $DebugSectionHeaderBreakPoints,
    $DebugSectionHeaderScope,
    $DebugSectionHeaderCallstack
  )

  return {
    $Viewlet,
    $Processes,
    $ButtonPauseContinue,
    $DebugSectionHeaderWatch,
    $DebugSectionHeaderBreakPoints,
    $DebugSectionHeaderScope,
    $DebugSectionHeaderCallstack,
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

const create$ScopeChain = (scopeChain, thisObject) => {
  console.log({ scopeChain })
  const $ScopeChain = document.createElement('div')
  for (const element of scopeChain) {
    const $Node = document.createElement('div')
    if (element.type === 'closure' && element.name) {
      $Node.textContent = `${element.type} (${element.name})`
    } else {
      $Node.textContent = element.type
    }
    $ScopeChain.append($Node)
  }
  return $ScopeChain
}

export const setScopeChain = (state, scopeChain) => {
  Assert.array(scopeChain)
  const { $DebugSectionHeaderScope } = state
  const $ScopeChain = create$ScopeChain(scopeChain)
  $DebugSectionHeaderScope.after($ScopeChain)
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
