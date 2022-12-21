import * as Assert from '../Assert/Assert.js'
import * as Icon from '../Icon/Icon.js'
import * as IconButton from '../IconButton/IconButton.js'
import * as MaskIcon from '../MaskIcon/MaskIcon.js'
import * as ViewletDebugEvents from './ViewletRunAndDebugEvents.js'

const create$DebugButton = (text, icon) => {
  const $Button = IconButton.create$Button(text, icon)
  $Button.className += ' DebugButton'
  return $Button
}

const create$DebugSectionHeader = (text) => {
  const $DebugSectionHeader = document.createElement('div')
  $DebugSectionHeader.className = 'DebugSectionHeader'
  $DebugSectionHeader.role = 'treeitem'
  $DebugSectionHeader.tabIndex = 0
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

  const $ButtonPauseContinue = create$DebugButton('pause', Icon.DebugContinue)

  const $ButtonStepOver = create$DebugButton('Step over', Icon.DebugStepOver)

  const $ButtonStepInto = create$DebugButton('Step into', Icon.DebugStepInto)

  const $ButtonStepOut = create$DebugButton('Step out', Icon.DebugStepOut)

  const $Processes = document.createElement('div')

  const $DebugSectionHeaderWatch = create$DebugSectionHeader('Watch')
  const $DebugSectionHeaderBreakPoints =
    create$DebugSectionHeader('Breakpoints')
  const $DebugSectionHeaderScope = create$DebugSectionHeader('Scope')
  const $DebugSectionHeaderCallStack = create$DebugSectionHeader('Call Stack')

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
    $DebugSectionHeaderCallStack
  )

  return {
    $Viewlet,
    $Processes,
    $ButtonPauseContinue,
    $DebugSectionHeaderWatch,
    $DebugSectionHeaderBreakPoints,
    $DebugSectionHeaderScope,
    $DebugSectionHeaderCallStack,
    $ButtonStepOut,
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
      $ButtonPauseContinue.ariaLabel = 'continue'
      $ButtonPauseContinue.title = 'continue'
      MaskIcon.setIcon($ButtonPauseContinue.firstChild, Icon.DebugContinue)
      break
    case 'default':
      $ButtonPauseContinue.ariaLabel = 'pause'
      $ButtonPauseContinue.title = 'pause'
      MaskIcon.setIcon($ButtonPauseContinue.firstChild, Icon.DebugPause)
      break
    default:
      break
  }
  console.log({ debugState })
}

const create$ScopeChain = (scopeChain, thisObject) => {
  const $ScopeChain = document.createElement('div')
  for (const element of scopeChain) {
    const $Node = document.createElement('div')
    switch (element.type) {
      case 'this':
        const $ThisKey = document.createElement('span')
        $ThisKey.textContent = element.key
        const $ThisValue = document.createElement('span')
        $ThisValue.textContent = element.value
        $Node.append($ThisKey, ': ', $ThisValue)
        break
      case 'scope':
        const $ScopeKey = document.createElement('span')
        $ScopeKey.className = 'DebugScopeKey'
        $ScopeKey.textContent = element.key
        $Node.append($ScopeKey)
        break
      case 'property':
        const $PropertyKey = document.createElement('span')
        $PropertyKey.textContent = element.key
        $PropertyKey.className = 'DebugPropertyKey'
        const $PropertyValue = document.createElement('span')
        switch (element.valueType) {
          case 'undefined':
            $PropertyValue.className = 'DebugValueUndefined'
            break
          case 'number':
            $PropertyValue.className = 'DebugValueNumber'
            break
          default:
            break
        }
        $PropertyValue.textContent = element.value
        $Node.append($PropertyKey, ': ', $PropertyValue)
        break
      default:
        throw new Error('unsupported scope type')
    }
    $Node.style.paddingLeft = `${element.indent}px`
    $ScopeChain.append($Node)
  }
  return $ScopeChain
}

export const setScopeChain = (state, scopeChain) => {
  Assert.array(scopeChain)
  const { $DebugSectionHeaderScope } = state
  const $ScopeChain = create$ScopeChain(scopeChain)
  const $Next = $DebugSectionHeaderScope.nextElementSibling
  if ($Next.className === 'DebugSectionHeader') {
    $DebugSectionHeaderScope.after($ScopeChain)
  } else {
    $Next.replaceWith($ScopeChain)
  }
}

const create$CallStack = (callStack) => {
  const $CallStack = document.createElement('div')
  for (const element of callStack) {
    const $Node = document.createElement('div')
    $Node.textContent = element.functionName
    $CallStack.append($Node)
  }
  return $CallStack
}

export const setCallStack = (state, callStack) => {
  const { $DebugSectionHeaderCallStack } = state
  const $CallStack = create$CallStack(callStack)
  const $Next = $DebugSectionHeaderCallStack.nextElementSibling
  if (!$Next || $Next.className === 'DebugSectionHeader') {
    $DebugSectionHeaderCallStack.after($CallStack)
  } else {
    $Next.replaceWith($CallStack)
  }
}

export const setPausedReason = (state, pausedReason) => {
  const { $ButtonStepOut } = state
  const $Next = $ButtonStepOut.nextElementSibling
  if ($Next.className === 'DebugPausedMessage') {
    $Next.textContent = `Debugger paused because of ${pausedReason}`
  } else {
    const $DebugPausedMessage = document.createElement('div')
    $DebugPausedMessage.className = 'DebugPausedMessage'
    $DebugPausedMessage.textContent = `Debugger paused because of ${pausedReason}`
    $ButtonStepOut.after($DebugPausedMessage)
  }
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
