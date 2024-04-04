/* Tries to implement the pattern for combobox with listbox popup https://www.w3.org/TR/wai-aria-1.2/#combobox */

import * as AriaAlert from '../AriaAlert/AriaAlert.ts'
import * as AriaAutoCompleteType from '../AriaAutoCompleteType/AriaAutoCompleteType.ts'
import * as AriaBoolean from '../AriaBoolean/AriaBoolean.ts'
import * as AriaRoleDescriptionType from '../AriaRoleDescriptionType/AriaRoleDescriptionType.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as AttachEvents from '../AttachEvents/AttachEvents.ts'
import * as DomAttributeType from '../DomAttributeType/DomAttributeType.ts'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.ts'
import * as DomEventType from '../DomEventType/DomEventType.ts'
import * as InputBox from '../InputBox/InputBox.ts'
import * as IsMobile from '../IsMobile/IsMobile.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as SetBounds from '../SetBounds/SetBounds.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.ts'
import * as WhenExpression from '../WhenExpression/WhenExpression.ts'
import * as ViewletQuickPickEvents from './ViewletQuickPickEvents.ts'

// TODO use another virtual list that just appends elements and
// is optimized for fast show/hide, scrolling performance should
// be good as well but is not as important as fast show/hide

// TODO screenreader makes pause after reading colon, maybe there is a setting for screenreaders so they speak normally

// TODO state

// TODO when quickpick is shown recalculate style and layout is really slow (>10ms every time)

// TODO accessibility issues with nvda: when pressing escape, it goes into different mode
// but should just close quick-pick like vscode does

const activeId = 'QuickPickItemActive'

// TODO forbidden:
// 1. methods
// 2. functions inside functions

/**
 * @enum {string}
 */
const Ids = {
  QuickPickHeader: 'QuickPickHeader',
  QuickPickItems: 'QuickPickItems',
  QuickPick: 'QuickPick',
}

// TODO add test with show and slicedItems length is 0

export const setFocusedIndex = (state, oldFocusedIndex, newFocusedIndex) => {
  const { $QuickPickInput } = state
  if (newFocusedIndex >= 0) {
    $QuickPickInput.setAttribute(DomAttributeType.AriaActiveDescendant, activeId)
  }
}

const focusElement = ($Element) => {
  if (!$Element) {
    return
  }
  if (IsMobile.isMobile) {
    // workaround to disable virtual keyboard automatically opening on android
    // see https://stackoverflow.com/questions/48635501/how-to-hide-soft-keyboard-and-keep-input-on-focus#answer-53104238
    $Element.readOnly = true
    $Element.focus()
    const handleTimeout = () => {
      $Element.readOnly = false
    }
    setTimeout(handleTimeout, 0)
  } else {
    $Element.focus()
  }
}

export const focus = (state) => {
  const { $QuickPickInput } = state
  focusElement($QuickPickInput)
  RendererWorker.send('Focus.setFocus', WhenExpression.FocusQuickPickInput)
}

// TODO
// - for windows narrator, ariaLabel works well
// - for nvda ariaRoleDescription works better

export const create = () => {
  const $QuickPickInput = InputBox.create()
  $QuickPickInput.setAttribute(DomAttributeType.AriaControls, Ids.QuickPickItems) // TODO use idl once supported
  $QuickPickInput.role = AriaRoles.ComboBox
  $QuickPickInput.ariaLabel = 'Type the name of a command to run.'
  $QuickPickInput.ariaAutoComplete = AriaAutoCompleteType.List
  $QuickPickInput.ariaExpanded = AriaBoolean.True

  const $QuickPickHeader = document.createElement('div')
  $QuickPickHeader.className = 'QuickPickHeader'
  $QuickPickHeader.append($QuickPickInput)

  const $QuickPickItems = document.createElement('div')
  $QuickPickItems.id = Ids.QuickPickItems
  $QuickPickItems.className = 'QuickPickItems'
  $QuickPickItems.role = AriaRoles.ListBox

  // TODO this works well with nvda but not with windows narrator
  // probably a bug with windows narrator that doesn't support ariaRoleDescription
  $QuickPickItems.ariaRoleDescription = AriaRoleDescriptionType.QuickInput

  const $QuickPick = document.createElement('div')
  $QuickPick.id = Ids.QuickPick
  $QuickPick.className = 'Viewlet QuickPick'
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

export const attachEvents = (state) => {
  const { $QuickPickItems, $QuickPickInput } = state
  AttachEvents.attachEvents($QuickPickItems, {
    [DomEventType.PointerDown]: ViewletQuickPickEvents.handlePointerDown,
  })
  $QuickPickItems.addEventListener(DomEventType.Wheel, ViewletQuickPickEvents.handleWheel, DomEventOptions.Passive)
  AttachEvents.attachEvents($QuickPickInput, {
    [DomEventType.Blur]: ViewletQuickPickEvents.handleBlur,
    [DomEventType.BeforeInput]: ViewletQuickPickEvents.handleBeforeInput,
  })
}

const create$QuickPickStatus = () => {
  const $QuickPickStatus = document.createElement('div')
  $QuickPickStatus.className = 'QuickPickStatus'
  // const te.$QuickPickStatus.role = AriaRoles.Status
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
  const { $QuickPickInput } = state
  $QuickPickInput.onblur = null
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
  SetBounds.setHeight($QuickPickItems, itemsHeight)
}

export const setItemsDom = (state, dom) => {
  const { $QuickPickItems } = state
  VirtualDom.renderInto($QuickPickItems, dom)
}

export const noop = (state) => {}
