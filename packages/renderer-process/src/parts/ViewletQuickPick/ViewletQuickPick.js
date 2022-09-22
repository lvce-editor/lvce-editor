/* Tries to implement the pattern for combobox with listbox popup https://www.w3.org/TR/wai-aria-1.2/#combobox */

import * as InputBox from '../InputBox/InputBox.js'
import * as VirtualDomPatch from '../VirtualDomPatch/VirtualDomPatch.js'
import * as ViewletQuickPickEvents from './ViewletQuickPickEvents.js'
import * as Focus from '../Focus/Focus.js'

// TODO use another virtual list that just appends elements and
// is optimized for fast show/hide, scrolling performance should
// be good as well but is not as important as fast show/hide

// TODO screenreader makes pause after reading colon, maybe there is a setting for screenreaders so they speak normally

// TODO state

// TODO when quickpick is shown recalculate style and layout is really slow (>10ms every time)

// TODO accessibility issues with nvda: when pressing escape, it goes into different mode
// but should just close quick-pick like vscode does

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

// TODO forbidden:
// 1. methods
// 2. functions inside functions

// TODO add test with show and slicedItems length is 0

export const focus = (state) => {
  const { $QuickPickInput } = state
  $QuickPickInput.focus()
  Focus.setFocus('quickPickInput')
}

// TODO
// - for windows narrator, ariaLabel works well
// - for nvda ariaRoleDescription works better

export const create = () => {
  const $QuickPickInput = InputBox.create()
  $QuickPickInput.ariaLabel = 'Type the name of a command to run.'
  // @ts-ignore
  $QuickPickInput.role = 'combobox'

  $QuickPickInput.onblur = ViewletQuickPickEvents.handleBlur
  $QuickPickInput.oninput = ViewletQuickPickEvents.handleInput
  $QuickPickInput.addEventListener(
    'beforeinput',
    ViewletQuickPickEvents.handleBeforeInput
  )

  const $QuickPickHeader = document.createElement('div')
  $QuickPickHeader.append($QuickPickInput)

  const $QuickPickItems = document.createElement('div')
  // @ts-ignore
  $QuickPickItems.role = 'listbox'
  $QuickPickItems.ariaRoleDescription = 'Quick Input'
  $QuickPickItems.id = 'QuickPickItems'
  $QuickPickItems.onmousedown = ViewletQuickPickEvents.handleMouseDown
  $QuickPickItems.addEventListener(
    'wheel',
    ViewletQuickPickEvents.handleWheel,
    { passive: true }
  )

  // TODO this works well with nvda but not with windows narrator
  // probably a bug with windows narrator that doesn't support ariaRoleDescription

  const $QuickPick = document.createElement('div')
  $QuickPick.ariaLabel = 'Quick open'
  $QuickPick.id = 'QuickPick'
  $QuickPick.append($QuickPickHeader, $QuickPickItems)

  return {
    $Viewlet: $QuickPick,
    $QuickPick,
    $QuickPickItems,
    $QuickPickInput,
    $QuickPickStatus: undefined,
  }
}

// TODO QuickPick module is always loaded lazily -> can create $QuickPick eagerly (no state / less state laying around)

// TODO remove from dom vs display none which should be used?

// TODO have common widgets container for all widgets (this, notifications, context menu)
export const dispose = (state) => {
  state.$QuickPickInput.onblur = null
}

export const setCursorOffset = (state, cursorOffset) => {
  const { $QuickPickInput } = state
  $QuickPickInput.selectionStart = cursorOffset
  $QuickPickInput.selectionEnd = cursorOffset
}

export const setDom = (state, patchList) => {
  const { $QuickPickItems } = state
  console.log({ patchList })
  VirtualDomPatch.patch($QuickPickItems, patchList)
}

export const setValue = (state, value) => {
  const { $QuickPickInput } = state
  $QuickPickInput.value = value
}

export const setFocusedIndex = (state, index) => {
  const { $QuickPickInput, $QuickPickItems } = state
  $QuickPickInput.setAttribute('aria-activedescendant', `QuickPickItemActive`)
  // console.log({ index })
}
