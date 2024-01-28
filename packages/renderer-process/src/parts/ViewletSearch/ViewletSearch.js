import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Assert from '../Assert/Assert.js'
import * as AttachEvents from '../AttachEvents/AttachEvents.js'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as EnterKeyHintType from '../EnterKeyHintType/EnterKeyHintType.js'
import * as IconButton from '../IconButton/IconButton.js'
import * as InputBox from '../InputBox/InputBox.js'
import * as MaskIcon from '../MaskIcon/MaskIcon.js'
import * as MaskImage from '../MaskImage/MaskImage.js'
import * as MultilineInputBox from '../MultilineInputBox/MultilineInputBox.js'
import * as VirtualDom from '../VirtualDom/VirtualDom.js'
import * as ViewletSearchEvents from './ViewletSearchEvents.js'

const activeId = 'TreeItemActive'
const focusClassName = 'FocusOutline'

/**
 * @enum {string}
 */
const UiStrings = {
  MatchCase: 'Match Case',
  MatchWholeWord: 'Match Whole Word',
  UseRegularExpression: 'Use Regular Expression',
  ToggleReplace: 'Toggle Replace',
  PreserveCase: 'Preserve Case',
  ReplaceAll: 'Replace All',
}

const create$SearchFieldButton = (title, icon) => {
  const $Icon = MaskIcon.create(icon)
  const $Button = document.createElement('div')
  $Button.role = AriaRoles.CheckBox
  $Button.className = 'SearchFieldButton'
  $Button.title = title
  $Button.append($Icon)
  return $Button
}

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Search'

  return {
    $Viewlet,
  }
}

export const attachEvents = (state) => {
  // const { $ViewletSearchInput, $ScrollBar, $SearchHeader, $List } = state
  // AttachEvents.attachEvents($ViewletSearchInput, {
  //   [DomEventType.Input]: ViewletSearchEvents.handleInput,
  //   [DomEventType.Focus]: ViewletSearchEvents.handleFocus,
  // })
  // AttachEvents.attachEvents($ScrollBar, {
  //   [DomEventType.PointerDown]: ViewletSearchEvents.handleScrollBarPointerDown,
  // })
  // AttachEvents.attachEvents($SearchHeader, {
  //   [DomEventType.Click]: ViewletSearchEvents.handleHeaderClick,
  // })
  // AttachEvents.attachEvents($List, {
  //   [DomEventType.Focus]: ViewletSearchEvents.handleListFocus,
  //   [DomEventType.Blur]: ViewletSearchEvents.handleListBlur,
  //   [DomEventType.MouseDown]: ViewletSearchEvents.handleClick,
  //   [DomEventType.ContextMenu]: ViewletSearchEvents.handleContextMenu,
  // })
  // $List.addEventListener(DomEventType.Wheel, ViewletSearchEvents.handleWheel, DomEventOptions.Passive)
}

export const refresh = (state, context) => {
  Assert.object(state)
}

export const focus = (state) => {
  Assert.object(state)
  state.$ViewletSearchInput.focus()
}

export const setDom = (state, dom) => {
  const { $ListItems } = state
  VirtualDom.renderInto($ListItems, dom)
}

export const setFullDom = (state, dom) => {
  // TODO replace this workaround with
  // virtual dom diffing
  const { $Viewlet } = state
  let input = ''
  let focused = document.activeElement.getAttribute('name')
  let $Input = $Viewlet.querySelector('[name="search-value"]')
  if ($Input) {
    input = $Input.value
  }
  let replaceInput = ''
  let $ReplaceInput = $Viewlet.querySelector('[name="search-replace-value"]')
  if ($ReplaceInput) {
    replaceInput = $ReplaceInput.value
  }
  VirtualDom.renderInto($Viewlet, dom, ViewletSearchEvents)
  $Input = $Viewlet.querySelector('[name="search-value"]')
  if ($Input) {
    $Input.value = input
  }
  $ReplaceInput = $Viewlet.querySelector('[name="search-replace-value"]')
  if ($ReplaceInput) {
    $ReplaceInput.value = replaceInput
  }
  if (focused) {
    const $Focused = $Viewlet.querySelector(`[name="${focused}"]`)
    if ($Focused) {
      $Focused.focus()
    }
  }
}

export const setMessage = (state, message) => {
  const { $SearchStatus } = state
  // TODO recycle text node
  $SearchStatus.textContent = message
}

export const setValue = (state, value) => {
  const { $ViewletSearchInput } = state
  $ViewletSearchInput.value = value
}

export const dispose = () => {}

// TODO duplicate code with extensions list

const create$ReplaceField = () => {
  const $Row = document.createElement('div')
  $Row.className = 'SearchField SearchFieldReplace'
  const $ButtonReplaceAllIcon = MaskIcon.create('ReplaceAll')
  const $ButtonReplaceAll = document.createElement('button')
  $ButtonReplaceAll.title = UiStrings.ReplaceAll
  $ButtonReplaceAll.className = 'SearchFieldButton'
  $ButtonReplaceAll.append($ButtonReplaceAllIcon)

  const $ViewletSearchReplaceInput = InputBox.create()
  $ViewletSearchReplaceInput.className = 'SearchFieldInput'
  $ViewletSearchReplaceInput.placeholder = 'Replace'
  $ViewletSearchReplaceInput.type = 'text'
  $ViewletSearchReplaceInput.name = 'search-replace-value'
  $ViewletSearchReplaceInput.oninput = ViewletSearchEvents.handleReplaceInput

  const $ButtonPreserveCase = document.createElement('button')
  $ButtonPreserveCase.title = UiStrings.PreserveCase
  const $IconPreserveCase = MaskIcon.create('ArrowDown')
  $ButtonPreserveCase.append($IconPreserveCase)

  $Row.append($ViewletSearchReplaceInput, $ButtonReplaceAll)
  return $Row
}

export const setReplaceExpanded = (state, replaceExpanded) => {
  const { $ViewletSearchReplaceInput, $ToggleButton, $SearchField, $ToggleButtonIcon } = state
  if (replaceExpanded) {
    $ToggleButton.ariaExpanded = true
    const $ViewletSearchReplaceInput = create$ReplaceField()
    $SearchField.after($ViewletSearchReplaceInput)
    state.$ViewletSearchReplaceInput = $ViewletSearchReplaceInput
    $ToggleButton.classList.add('SearchToggleButtonExpanded')
    MaskImage.unsetMaskImage($ToggleButtonIcon, 'ChevronRight')
    MaskImage.setMaskImage($ToggleButtonIcon, 'ChevronDown')
  } else {
    $ToggleButton.ariaExpanded = false
    $ViewletSearchReplaceInput.remove()
    state.$ViewletSearchReplaceInput = undefined
    $ToggleButton.classList.remove('SearchToggleButtonExpanded')
    MaskImage.unsetMaskImage($ToggleButtonIcon, 'ChevronDown')
    MaskImage.setMaskImage($ToggleButtonIcon, 'ChevronRight')
  }
}

export const setButtonsChecked = (state, matchWholeWord, useRegularExpression, matchCase) => {
  const { $ButtonMatchWholeWord, $ButtonUseRegularExpression, $ButtonMatchCase } = state
  $ButtonMatchWholeWord.ariaChecked = matchWholeWord
  $ButtonMatchWholeWord.classList.toggle('SearchFieldButtonChecked', matchWholeWord)
  $ButtonUseRegularExpression.ariaChecked = useRegularExpression
  $ButtonUseRegularExpression.classList.toggle('SearchFieldButtonChecked', useRegularExpression)
  $ButtonMatchCase.ariaChecked = matchCase
  $ButtonMatchCase.classList.toggle('SearchFieldButtonChecked', matchCase)
}

export * from '../ViewletScrollable/ViewletScrollable.js'
