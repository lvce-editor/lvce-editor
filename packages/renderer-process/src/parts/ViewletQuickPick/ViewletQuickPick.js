/* Tries to implement the pattern for combobox with listbox popup https://www.w3.org/TR/wai-aria-1.2/#combobox */

import * as AriaAlert from '../AriaAlert/AriaAlert.js'
import * as Focus from '../Focus/Focus.js'
import * as InputBox from '../InputBox/InputBox.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'

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

const handleWheel = (event) => {
  switch (event.deltaMode) {
    case event.DOM_DELTA_LINE:
      RendererWorker.send(
        /* QuickPick.handleWheel */ 'QuickPick.handleWheel',
        /* deltaY */ event.deltaY
      )
      break
    case event.DOM_DELTA_PIXEL:
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

const create$QuickPickItem = () => {
  // TODO many quickPick items may not have description -> avoid creating description dom nodes if there is no description
  const $QuickPickItemLabelText = document.createTextNode('')

  const $QuickPickItemLabel = document.createElement('div')
  $QuickPickItemLabel.className = 'QuickPickItemLabel'
  $QuickPickItemLabel.append($QuickPickItemLabelText)
  // $QuickPickItemLabel.textContent = item.label || '<missing label>'
  // const $QuickPickItemDescription = document.createElement('div')
  // $QuickPickItemDescription.className = 'QuickPickItemDescription'
  // $QuickPickItemDescription.textContent = item.description
  const $QuickPickItem = document.createElement('div') // TODO ul/li would be better for structure but might be slower
  $QuickPickItem.className = 'QuickPickItem'
  // @ts-ignore
  $QuickPickItem.role = 'option'
  // $QuickPickItem.id = `QuickPickItem-${index}`
  // $QuickPickItem.dataset.index = index
  // $QuickPickItem.ariaPosInSet = `${index + 1}`
  // $QuickPickItem.ariaSetSize = `${total}`
  $QuickPickItem.append($QuickPickItemLabel)
  return $QuickPickItem
}

export const focusIndex = (state, oldIndex, newIndex) => {
  if (oldIndex === newIndex) {
    return
  }
  const $QuickPickItems = state.$QuickPickItems
  if (oldIndex !== -1) {
    const $OldItem = $QuickPickItems.children[oldIndex]
    $OldItem.classList.remove('Focused')
  }
  const $NewItem = $QuickPickItems.children[newIndex]
  $NewItem.classList.add('Focused')
  state.$QuickPickInput.setAttribute('aria-activedescendant', $NewItem.id)
}

// TODO add test with show and slicedItems length is 0

const create$QuickPickDescription = () => {
  const $QuickPickItemDescription = document.createElement('div')
  $QuickPickItemDescription.className = 'QuickPickItemDescription'
  return $QuickPickItemDescription
}

const render$QuickPickItemLabel = ($QuickPickItemLabel, quickPickItem) => {
  $QuickPickItemLabel.firstChild.nodeValue = quickPickItem.label
}

const render$QuickPickItemLess = ($QuickPickItem, quickPickItem) => {
  render$QuickPickItemLabel($QuickPickItem.firstChild, quickPickItem)
  const $QuickPickItemDescription = create$QuickPickDescription()
  // render$QuickPickItemDescription($QuickPickItemDescription, quickPickItem)

  $QuickPickItem.append($QuickPickItemDescription)
}

const render$QuickPickItemEqual = ($QuickPickItem, quickPickItem) => {
  render$QuickPickItemLabel($QuickPickItem.firstChild, quickPickItem)
  if (quickPickItem.description) {
    // render$QuickPickItemDescription($QuickPickItem.children[1], quickPickItem)
  }
}

const render$QuickPickItemMore = ($QuickPickItem, quickPickItem) => {
  render$QuickPickItemLabel($QuickPickItem.firstChild, quickPickItem)
  $QuickPickItem.lastChild.remove()
}

const render$QuickPickItem = ($QuickPickItem, quickPickItem) => {
  const lengthA = $QuickPickItem.children.length
  const lengthB = quickPickItem.description ? 2 : 1
  $QuickPickItem.id = `QuickPickItem-${quickPickItem.posInSet}`
  $QuickPickItem.ariaPosInSet = `${quickPickItem.posInSet}` // TODO pass correct number as prop
  $QuickPickItem.ariaSetSize = `${quickPickItem.setSize}`
  if (lengthA < lengthB) {
    render$QuickPickItemLess($QuickPickItem, quickPickItem)
  } else if (lengthA === lengthB) {
    render$QuickPickItemEqual($QuickPickItem, quickPickItem)
  } else {
    render$QuickPickItemMore($QuickPickItem, quickPickItem)
  }
}

const render$QuickPickItemsLess = ($QuickPickItems, quickPickItems) => {
  for (let i = 0; i < $QuickPickItems.children.length; i++) {
    render$QuickPickItem($QuickPickItems.children[i], quickPickItems[i])
  }
  const fragment = document.createDocumentFragment()
  for (
    let i = $QuickPickItems.children.length;
    i < quickPickItems.length;
    i++
  ) {
    const $QuickPickItem = create$QuickPickItem()
    render$QuickPickItem($QuickPickItem, quickPickItems[i])
    fragment.append($QuickPickItem)
  }
  $QuickPickItems.append(fragment)
}

const render$QuickPickItemsEqual = ($QuickPickItems, quickPickItems) => {
  for (let i = 0; i < quickPickItems.length; i++) {
    render$QuickPickItem($QuickPickItems.children[i], quickPickItems[i])
  }
}

const render$QuickPickItemsMore = ($QuickPickItems, quickPickItems) => {
  for (let i = 0; i < quickPickItems.length; i++) {
    render$QuickPickItem($QuickPickItems.children[i], quickPickItems[i])
  }
  const diff = $QuickPickItems.children.length - quickPickItems.length
  for (let i = 0; i < diff; i++) {
    $QuickPickItems.lastChild.remove()
  }
}

const render$QuickPickItems = ($QuickPickItems, quickPickItems) => {
  if ($QuickPickItems.children.length < quickPickItems.length) {
    render$QuickPickItemsLess($QuickPickItems, quickPickItems)
  } else if ($QuickPickItems.children.length === quickPickItems.length) {
    render$QuickPickItemsEqual($QuickPickItems, quickPickItems)
  } else {
    render$QuickPickItemsMore($QuickPickItems, quickPickItems)
  }
}

export const setVisiblePicks = (state, visiblePicks) => {
  if (state.$QuickPickStatus) {
    hideStatus(state)
  }
  render$QuickPickItems(state.$QuickPickItems, visiblePicks)
}

export const setFocusedIndex = (state, oldFocusedIndex, newFocusedIndex) => {
  const { $QuickPickItems, $QuickPickInput } = state
  if (oldFocusedIndex !== -1) {
    const $OldItem = $QuickPickItems.children[oldFocusedIndex]
    if ($OldItem) {
      $OldItem.classList.remove('Focused')
    }
  }
  if (newFocusedIndex >= 0) {
    const $NewItem = $QuickPickItems.children[newFocusedIndex]
    if ($NewItem) {
      $NewItem.classList.add('Focused')
      $QuickPickInput.setAttribute('aria-activedescendant', $NewItem.id)
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
  $QuickPickInput.setAttribute('aria-controls', 'QuickPickItems') // TODO use idl once supported
  // @ts-ignore
  $QuickPickInput.role = 'combobox'
  $QuickPickInput.ariaLabel = 'Type the name of a command to run.'
  $QuickPickInput.ariaAutoComplete = 'list'
  $QuickPickInput.onblur = handleBlur
  $QuickPickInput.oninput = handleInput
  $QuickPickInput.addEventListener('beforeinput', handleBeforeInput)
  $QuickPickInput.ariaExpanded = 'true'

  const $QuickPickHeader = document.createElement('div')
  $QuickPickHeader.id = 'QuickPickHeader'
  $QuickPickHeader.append($QuickPickInput)

  const $QuickPickItems = document.createElement('div')
  $QuickPickItems.id = 'QuickPickItems'
  // @ts-ignore
  $QuickPickItems.role = 'listbox'
  $QuickPickItems.onmousedown = handleMouseDown
  $QuickPickItems.addEventListener('wheel', handleWheel, { passive: true })

  // TODO this works well with nvda but not with windows narrator
  // probably a bug with windows narrator that doesn't support ariaRoleDescription
  $QuickPickItems.ariaRoleDescription = 'Quick Input'

  const $QuickPick = document.createElement('div')
  $QuickPick.id = 'QuickPick'
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

export const setPicks = (state, visiblePicks) => {
  render$QuickPickItems(state.$QuickPickItems, visiblePicks)
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
  setPicks(state, [])
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
  console.log('dispose quickpick')
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
