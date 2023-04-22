/* Tries to implement the pattern for combobox with listbox popup https://www.w3.org/TR/wai-aria-1.2/#combobox */

import * as ComponentUid from '../ComponentUid/ComponentUid.js'
import * as Event from '../Event/Event.js'
import * as Platform from '../Platform/Platform.js'
import * as ViewletQuickPickFunctions from './ViewletQuickPickFunctions.js'

// TODO use another virtual list that just appends elements and
// is optimized for fast show/hide, scrolling performance should
// be good as well but is not as important as fast show/hide

// TODO screenreader makes pause after reading colon, maybe there is a setting for screenreaders so they speak normally

// TODO state

// TODO when quickpick is shown recalculate style and layout is really slow (>10ms every time)

// TODO accessibility issues with nvda: when pressing escape, it goes into different mode
// but should just close quick-pick like vscode does

const getNodeIndex = ($Node) => {
  let index = 0
  while (($Node = $Node.previousElementSibling)) {
    index++
  }
  return index
}

const getTargetIndex = ($Target) => {
  switch ($Target.className) {
    case 'QuickPickItem':
    case 'QuickPickItem Focused':
      return getNodeIndex($Target)
    case 'QuickPickItemLabel':
      return getNodeIndex($Target.parentNode)
    default:
      return -1
  }
}

export const handleWheel = (event) => {
  const { deltaMode, deltaY } = event
  const uid = ComponentUid.fromEvent(event)
  ViewletQuickPickFunctions.handleWheel(uid, deltaMode, deltaY)
}

export const handlePointerDown = (event) => {
  if (Platform.isMobile) {
    // workaround to disable virtual keyboard automatically opening on android
    // see https://stackoverflow.com/questions/48635501/how-to-hide-soft-keyboard-and-keep-input-on-focus#answer-53104238
    const $Input = document.querySelector('#QuickPickHeader .InputBox')
    // @ts-ignore
    $Input.readOnly = true
  }
  Event.preventDefault(event)
  const { clientX, clientY } = event
  const uid = ComponentUid.fromEvent(event)
  ViewletQuickPickFunctions.handleClickAt(uid, clientX, clientY)
}

// TODO beforeinput event should prevent input event maybe
// const handleBeforeInput = (event) => {
//   if (!event.data) {
//     return
//   }
//   const value = event.target.value + event.data
//   RendererWorker.send(
//     /* quickPickHandleInput */ 'QuickPick.handleInput',
//     /* value */ value,
//   )
// }

export const handleInput = (event) => {
  const $Target = event.target
  const { value } = $Target
  const uid = ComponentUid.fromEvent(event)
  ViewletQuickPickFunctions.handleInput(uid, value)
}

export const handleBlur = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ViewletQuickPickFunctions.handleBlur(uid)
}

// TODO
// - for windows narrator, ariaLabel works well
// - for nvda ariaRoleDescription works better

export const handleBeforeInput = (event) => {
  Event.preventDefault(event)
  const { target, inputType, data } = event
  const { selectionStart, selectionEnd } = target
  const uid = ComponentUid.fromEvent(event)
  ViewletQuickPickFunctions.handleBeforeInput(uid, inputType, data, selectionStart, selectionEnd)
}
