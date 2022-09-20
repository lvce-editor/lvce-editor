/* Tries to implement the pattern for combobox with listbox popup https://www.w3.org/TR/wai-aria-1.2/#combobox */

import * as AriaAlert from '../AriaAlert/AriaAlert.js'
import * as Focus from '../Focus/Focus.js'
import * as InputBox from '../InputBox/InputBox.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as WheelEventType from '../WheelEventType/WheelEventType.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'

// TODO use another virtual list that just appends elements and
// is optimized for fast show/hide, scrolling performance should
// be good as well but is not as important as fast show/hide

// TODO screenreader makes pause after reading colon, maybe there is a setting for screenreaders so they speak normally

// TODO state

// TODO when quickpick is shown recalculate style and layout is really slow (>10ms every time)

// TODO accessibility issues with nvda: when pressing escape, it goes into different mode
// but should just close quick-pick like vscode does

const activeId = 'QuickPickItemActive'

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

const handleWheel = (event) => {
  switch (event.deltaMode) {
    case WheelEventType.DomDeltaLine:
      RendererWorker.send(
        /* QuickPick.handleWheel */ 'QuickPick.handleWheel',
        /* deltaY */ event.deltaY
      )
      break
    case WheelEventType.DomDeltaPixel:
      RendererWorker.send(
        /* QuickPick.handleWheel */ 'QuickPick.handleWheel',
        /* deltaY */ event.deltaY
      )
      break
    default:
      break
  }
}

const handleMouseDown = (event) => {
  event.preventDefault()
  const $Target = event.target
  const index = getTargetIndex($Target)
  if (index === -1) {
    return
  }
  // console.log('button', event.button)
  // console.log({ index })
  RendererWorker.send(
    /* QuickPick.selectIndex */ 'QuickPick.selectIndex',
    /* index */ index
  )
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

const handleInput = (event) => {
  const $Target = event.target
  RendererWorker.send(
    /* quickPickHandleInput */ 'QuickPick.handleInput',
    /* value */ $Target.value
  )
}
const handleBlur = (event) => {
  RendererWorker.send(/* QuickPick.handleBlur */ 'QuickPick.handleBlur')
}

// TODO forbidden:
// 1. methods
// 2. functions inside functions

const Ids = {
  QuickPickHeader: 'QuickPickHeader',
  QuickPickItems: 'QuickPickItems',
  QuickPick: 'QuickPick',
}

const Roles = {
  ListBox: 'listbox',
  ComboBox: 'combobox',
  Option: 'option',
}

// TODO add test with show and slicedItems length is 0

export const setFocusedIndex = (state, oldFocusedIndex, newFocusedIndex) => {
  const { $QuickPickItems, $QuickPickInput } = state
  if (oldFocusedIndex >= 0) {
    const $OldItem = $QuickPickItems.children[oldFocusedIndex]
    if ($OldItem) {
      $OldItem.removeAttribute('id')
    }
  }
  if (newFocusedIndex >= 0) {
    const $NewItem = $QuickPickItems.children[newFocusedIndex]
    if ($NewItem) {
      $NewItem.id = activeId
      $QuickPickInput.setAttribute('aria-activedescendant', activeId)
    }
  }
}

export const focus = (state) => {
  const { $QuickPickInput } = state
  $QuickPickInput.focus()
  Focus.setFocus('quickPickInput')
}

// TODO
// - for windows narrator, ariaLabel works well
// - for nvda ariaRoleDescription works better

const handleBeforeInput = (event) => {
  event.preventDefault()
  const $Target = event.target
  const selectionStart = $Target.selectionStart
  const selectionEnd = $Target.selectionEnd
  const inputType = event.inputType
  const data = event.data
  RendererWorker.send(
    'QuickPick.handleBeforeInput',
    /* inputType */ inputType,
    /* data */ data,
    /* selectionStart */ selectionStart,
    /* selectionEnd */ selectionEnd
  )
}

export const create = () => {
  const $QuickPickInput = InputBox.create()
  $QuickPickInput.setAttribute('aria-controls', Ids.QuickPickItems) // TODO use idl once supported
  // @ts-ignore
  $QuickPickInput.role = Roles.ComboBox
  $QuickPickInput.ariaLabel = 'Type the name of a command to run.'
  $QuickPickInput.ariaAutoComplete = 'list'
  $QuickPickInput.onblur = handleBlur
  $QuickPickInput.oninput = handleInput
  $QuickPickInput.addEventListener('beforeinput', handleBeforeInput)
  $QuickPickInput.ariaExpanded = 'true'

  const $QuickPickHeader = document.createElement('div')
  $QuickPickHeader.id = Ids.QuickPickHeader
  $QuickPickHeader.append($QuickPickInput)

  const $QuickPickItems = document.createElement('div')
  $QuickPickItems.id = Ids.QuickPickItems
  // @ts-ignore
  $QuickPickItems.role = Roles.ListBox
  $QuickPickItems.onmousedown = handleMouseDown
  $QuickPickItems.addEventListener('wheel', handleWheel, { passive: true })

  // TODO this works well with nvda but not with windows narrator
  // probably a bug with windows narrator that doesn't support ariaRoleDescription
  $QuickPickItems.ariaRoleDescription = 'Quick Input'

  const $QuickPick = document.createElement('div')
  $QuickPick.id = Ids.QuickPick
  // $QuickPick.role= 'dialog'
  $QuickPick.append($QuickPickHeader, $QuickPickItems)
  // $QuickPick.setAttribute('aria-modal', 'false') // TODO why is this
  $QuickPick.ariaLabel = 'Quick open'

  return {
    $Viewlet: $QuickPick,
    $QuickPick,
    $QuickPickInput,
    $QuickPickItems,
    $QuickPickStatus: undefined,
  }
}

const create$QuickPickStatus = () => {
  const $QuickPickStatus = document.createElement('div')
  $QuickPickStatus.className = 'QuickPickStatus'
  // const te.$QuickPickStatus.role = 'status'
  // $QuickPickStatus.ariaLive = 'polite'
  // $QuickPickStatus.id = 'QuickPickStatus'
  return $QuickPickStatus
}

export const hideStatus = (state) => {
  state.$QuickPickStatus.remove()
  state.$QuickPickStatus = undefined
}

export const showNoResults = (state, noResults, unfocusIndex) => {
  if (!state.$QuickPickStatus) {
    state.$QuickPickStatus = create$QuickPickStatus()
    state.$QuickPick.append(state.$QuickPickStatus)
  }
  state.$QuickPickStatus.textContent = 'No Results'

  // announce to screenreaders that there are no results
  AriaAlert.alert('No results')
}

// TODO QuickPick module is always loaded lazily -> can create $QuickPick eagerly (no state / less state laying around)

// TODO remove from dom vs display none which should be used?

// TODO have common widgets container for all widgets (this, notifications, context menu)
export const dispose = (state) => {
  state.$QuickPickInput.onblur = null
}

export const setValue = (state, value) => {
  const { $QuickPickInput } = state
  $QuickPickInput.value = value
}

export const setCursorOffset = (state, cursorOffset) => {
  const { $QuickPickInput } = state
  $QuickPickInput.selectionStart = cursorOffset
  $QuickPickInput.selectionEnd = cursorOffset
}

export const setItemsHeight = (state, itemsHeight) => {
  const { $QuickPickItems } = state
  $QuickPickItems.style.height = `${itemsHeight}px`
}

export const setDom = (state, dom) => {
  const { $QuickPickItems } = state
  const $Root = VirtualDom.render(dom)
  // @ts-ignore
  $QuickPickItems.replaceChildren(...$Root.firstChild.children)
}
