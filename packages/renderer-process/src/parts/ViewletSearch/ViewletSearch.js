import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Assert from '../Assert/Assert.js'
import * as AttachEvents from '../AttachEvents/AttachEvents.js'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as EnterKeyHintType from '../EnterKeyHintType/EnterKeyHintType.js'
import * as Icon from '../Icon/Icon.js'
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
  // TODO vscode uses a textarea instead of an input
  // which is better because it supports multiline input
  // but it is difficult to implement because the vscode
  // textarea has a flexible max height.
  // The implementation uses a mirror dom element,
  // on text area input the text copied to the
  // mirror dom element, then the mirror dom element height
  // is measured and in turn applied to the text area.
  // This way the text area always has the smallest
  // necessary height value.
  const $ViewletSearchInput = MultilineInputBox.create()
  $ViewletSearchInput.placeholder = 'Search'
  $ViewletSearchInput.enterKeyHint = EnterKeyHintType.Search
  $ViewletSearchInput.name = 'search-value'

  const $ButtonMatchCase = create$SearchFieldButton(UiStrings.MatchCase, Icon.CaseSensitive)
  const $ButtonMatchWholeWord = create$SearchFieldButton(UiStrings.MatchWholeWord, Icon.WholeWord)
  const $ButtonUseRegularExpression = create$SearchFieldButton(UiStrings.UseRegularExpression, Icon.Regex)

  const $SearchField = document.createElement('div')
  $SearchField.className = 'SearchField'
  $SearchField.append($ViewletSearchInput, $ButtonMatchCase, $ButtonMatchWholeWord, $ButtonUseRegularExpression)

  const $ToggleButton = IconButton.create$Button(UiStrings.ToggleReplace, Icon.ChevronRight)
  $ToggleButton.classList.add('SearchToggleButton')
  const $ToggleButtonIcon = $ToggleButton.firstChild

  const $SearchStatus = document.createElement('div')
  // @ts-ignore
  $SearchStatus.role = AriaRoles.Status
  $SearchStatus.className = 'ViewletSearchMessage'

  const $SearchHeader = document.createElement('div')
  $SearchHeader.className = 'SearchHeader'
  $SearchHeader.append($ToggleButton, $SearchField, $SearchStatus)

  const $ListItems = document.createElement('div')
  $ListItems.className = 'ListItems'
  $ListItems.role = AriaRoles.None
  // TODO onclick vs onmousedown, should be consistent in whole application

  const $ScrollBarThumb = document.createElement('div')
  $ScrollBarThumb.className = 'ScrollBarThumb'

  const $ScrollBar = document.createElement('div')
  $ScrollBar.className = 'ScrollBarSmall'
  $ScrollBar.append($ScrollBarThumb)

  const $List = document.createElement('div')
  $List.className = 'Viewlet List'
  $List.role = AriaRoles.Tree
  $List.tabIndex = 0
  $List.append($ListItems, $ScrollBar)

  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Search'
  $Viewlet.append($SearchHeader, $List)

  return {
    $Viewlet,
    $ViewletSearchInput,
    $ListItems,
    $List,
    $SearchStatus,
    $ScrollBar,
    $ScrollBarThumb,
    $ToggleButton,
    $SearchHeader,
    $ViewletSearchReplaceInput: undefined,
    $SearchField,
    $ButtonMatchCase,
    $ButtonMatchWholeWord,
    $ButtonUseRegularExpression,
    $ToggleButtonIcon,
  }
}

export const attachEvents = (state) => {
  const { $ViewletSearchInput, $ScrollBar, $SearchHeader, $List } = state
  AttachEvents.attachEvents($ViewletSearchInput, {
    [DomEventType.Input]: ViewletSearchEvents.handleInput,
    [DomEventType.Focus]: ViewletSearchEvents.handleFocus,
  })

  AttachEvents.attachEvents($ScrollBar, {
    [DomEventType.PointerDown]: ViewletSearchEvents.handleScrollBarPointerDown,
  })

  AttachEvents.attachEvents($SearchHeader, {
    [DomEventType.Click]: ViewletSearchEvents.handleHeaderClick,
  })

  AttachEvents.attachEvents($List, {
    [DomEventType.Focus]: ViewletSearchEvents.handleListFocus,
    [DomEventType.Blur]: ViewletSearchEvents.handleListBlur,
    [DomEventType.MouseDown]: ViewletSearchEvents.handleClick,
    [DomEventType.ContextMenu]: ViewletSearchEvents.handleContextMenu,
  })

  $List.addEventListener(DomEventType.Wheel, ViewletSearchEvents.handleWheel, DomEventOptions.Passive)
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
  const $ButtonReplaceAllIcon = MaskIcon.create(Icon.ReplaceAll)
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
  const $IconPreserveCase = MaskIcon.create(Icon.ArrowDown)
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
    MaskImage.setMaskImage($ToggleButtonIcon, Icon.ChevronDown)
  } else {
    $ToggleButton.ariaExpanded = false
    $ViewletSearchReplaceInput.remove()
    state.$ViewletSearchReplaceInput = undefined
    $ToggleButton.classList.remove('SearchToggleButtonExpanded')
    MaskImage.setMaskImage($ToggleButtonIcon, Icon.ChevronRight)
  }
}

export const setButtonsChecked = (state, matchWholeWord, useRegularExpression, matchCase) => {
  const { $ButtonMatchWholeWord, $ButtonUseRegularExpression, $ButtonMatchCase } = state
  $ButtonMatchWholeWord.ariaChecked = matchWholeWord
  $ButtonUseRegularExpression.ariaChecked = useRegularExpression
  $ButtonMatchCase.ariaChecked = matchCase
}

export * from '../ViewletScrollable/ViewletScrollable.js'
