import * as AriaBoolean from '../AriaBoolean/AriaBoolean.js'
import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Assert from '../Assert/Assert.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as DomEventOptions from '../DomEventOptions/DomEventOptions.js'
import * as DomEventType from '../DomEventType/DomEventType.js'
import * as EnterKeyHintType from '../EnterKeyHintType/EnterKeyHintType.js'
import * as Icon from '../Icon/Icon.js'
import * as InputBox from '../InputBox/InputBox.js'
import * as Label from '../Label/Label.js'
import * as MaskIcon from '../MaskIcon/MaskIcon.js'
import * as SetBounds from '../SetBounds/SetBounds.js'
import * as ViewletSearchEvents from './ViewletSearchEvents.js'
import * as InputType from '../InputType/InputType.js'

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
  const $ViewletSearchInput = InputBox.create()
  $ViewletSearchInput.classList.add('SearchFieldInput')
  $ViewletSearchInput.placeholder = 'Search'
  $ViewletSearchInput.type = InputType.Search
  $ViewletSearchInput.enterKeyHint = EnterKeyHintType.Search

  const $ButtonMatchCase = create$SearchFieldButton(UiStrings.MatchCase, Icon.ArrowDown)
  const $ButtonMatchWholeWord = create$SearchFieldButton(UiStrings.MatchWholeWord, Icon.ArrowDown)
  const $ButtonUseRegularExpression = create$SearchFieldButton(UiStrings.UseRegularExpression, Icon.ArrowDown)

  const $SearchField = document.createElement('div')
  $SearchField.className = 'SearchField'
  $SearchField.append($ViewletSearchInput, $ButtonMatchCase, $ButtonMatchWholeWord, $ButtonUseRegularExpression)

  const $ToggleButton = document.createElement('button')
  $ToggleButton.className = 'SearchToggleButton'
  $ToggleButton.textContent = 'T'
  $ToggleButton.title = UiStrings.ToggleReplace

  const $SearchStatus = document.createElement('div')
  // @ts-ignore
  $SearchStatus.role = AriaRoles.Status
  $SearchStatus.className = 'ViewletSearchMessage'

  const $SearchHeader = document.createElement('div')
  $SearchHeader.className = 'SearchHeader'
  $SearchHeader.append($ToggleButton, $SearchField, $SearchStatus)

  const $ListItems = document.createElement('div')
  $ListItems.className = 'ListItems'
  // TODO onclick vs onmousedown, should be consistent in whole application

  const $ScrollBarThumb = document.createElement('div')
  $ScrollBarThumb.className = 'ScrollBarThumb'

  const $ScrollBar = document.createElement('div')
  $ScrollBar.className = 'ScrollBarSmall'
  $ScrollBar.append($ScrollBarThumb)

  const $List = document.createElement('div')
  $List.className = 'Viewlet List'
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
  }
}

export const attachEvents = (state) => {
  const { $ViewletSearchInput, $ListItems, $ScrollBar, $ToggleButton, $SearchHeader } = state
  $ViewletSearchInput.oninput = ViewletSearchEvents.handleInput
  $ViewletSearchInput.onfocus = ViewletSearchEvents.handleFocus

  $ListItems.onmousedown = ViewletSearchEvents.handleClick
  $ListItems.oncontextmenu = ViewletSearchEvents.handleContextMenu
  $ListItems.addEventListener(DomEventType.Wheel, ViewletSearchEvents.handleWheel, DomEventOptions.Passive)

  $ScrollBar.onpointerdown = ViewletSearchEvents.handleScrollBarPointerDown

  $SearchHeader.onclick = ViewletSearchEvents.handleHeaderClick
}

export const refresh = (state, context) => {
  Assert.object(state)
}

export const focus = (state) => {
  Assert.object(state)
  state.$ViewletSearchInput.focus()
}

const create$Row = () => {
  const $Row = document.createElement('div')
  // @ts-ignore
  $Row.role = AriaRoles.TreeItem
  $Row.className = 'TreeItem'
  const $Label = Label.create('')
  const $Icon = document.createElement('i')
  $Row.append($Icon, $Label)
  return $Row
}

// TODO much duplication with explorer
const render$Row = ($Row, rowInfo) => {
  const { top, type, matchStart, matchLength, text, title, icon, setSize, posInSet, depth } = rowInfo
  const $Icon = $Row.childNodes[0]
  const $Label = $Row.childNodes[1]
  $Icon.className = `FileIcon${icon}`
  if (matchLength) {
    const before = text.slice(0, matchStart)
    const highlight = text.slice(matchStart, matchStart + matchLength)
    const after = text.slice(matchStart + matchLength)
    const $Before = document.createTextNode(before)
    const $Highlight = document.createElement('span')
    $Highlight.className = 'Highlight'
    $Highlight.textContent = highlight
    const $After = document.createTextNode(after)
    $Label.replaceChildren($Before, $Highlight, $After)
  } else {
    $Label.textContent = text
  }
  $Row.title = title
  $Row.ariaSetSize = `${setSize}`
  $Row.ariaLevel = `${depth}`
  $Row.ariaPosInSet = `${posInSet}`
  $Row.ariaLabel = rowInfo.name
  $Row.ariaDescription = ''
  SetBounds.setTop($Row, top)
  switch (type) {
    // TODO type should be a number for efficiency
    case DirentType.Directory:
      $Row.ariaExpanded = AriaBoolean.False
      break
    case DirentType.DirectoryExpanded:
      $Row.ariaExpanded = AriaBoolean.True
      break
    case DirentType.File:
      $Row.ariaExpanded = undefined
      break
    default:
      break
  }
}

const render$RowsLess = ($Rows, rowInfos) => {
  for (let i = 0; i < $Rows.children.length; i++) {
    render$Row($Rows.children[i], rowInfos[i])
  }
  const fragment = document.createDocumentFragment()
  for (let i = $Rows.children.length; i < rowInfos.length; i++) {
    const $Row = create$Row()
    render$Row($Row, rowInfos[i])
    fragment.append($Row)
  }
  $Rows.append(fragment)
}

const render$RowsEqual = ($Rows, rowInfos) => {
  for (let i = 0; i < rowInfos.length; i++) {
    render$Row($Rows.children[i], rowInfos[i])
  }
}

const render$RowsMore = ($Rows, rowInfos) => {
  for (let i = 0; i < rowInfos.length; i++) {
    render$Row($Rows.children[i], rowInfos[i])
  }
  const diff = $Rows.children.length - rowInfos.length
  for (let i = 0; i < diff; i++) {
    $Rows.lastChild.remove()
  }
}

const render$Rows = ($Rows, rowInfos) => {
  if ($Rows.children.length < rowInfos.length) {
    render$RowsLess($Rows, rowInfos)
  } else if ($Rows.children.length === rowInfos.length) {
    render$RowsEqual($Rows, rowInfos)
  } else {
    render$RowsMore($Rows, rowInfos)
  }
}

export const setResults = (state, results) => {
  Assert.object(state)
  Assert.array(results)
  const { $ListItems } = state
  // TODO should recycle nodes when rendering only search results
  // maybe could also recycle node from noResults and vice versa
  render$Rows($ListItems, results)
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

export const setContentHeight = (state, height) => {
  const { $ListItems } = state
  SetBounds.setHeight($ListItems, height)
}

export const setNegativeMargin = (state, negativeMargin) => {
  const { $ListItems } = state
  SetBounds.setTop($ListItems, negativeMargin)
}

const create$ReplaceField = () => {
  const $Row = document.createElement('div')
  $Row.className = 'SearchField'
  const $ButtonReplaceAllIcon = MaskIcon.create(Icon.ArrowDown)
  const $ButtonReplaceAll = document.createElement('button')
  $ButtonReplaceAll.title = UiStrings.ReplaceAll
  $ButtonReplaceAll.className = 'SearchFieldButton'
  $ButtonReplaceAll.append($ButtonReplaceAllIcon)

  const $ViewletSearchReplaceInput = InputBox.create()
  $ViewletSearchReplaceInput.placeholder = 'Replace'
  $ViewletSearchReplaceInput.type = 'text'

  const $ButtonPreserveCase = document.createElement('button')
  $ButtonPreserveCase.title = UiStrings.PreserveCase
  const $IconPreserveCase = MaskIcon.create(Icon.ArrowDown)
  $ButtonPreserveCase.append($IconPreserveCase)

  $Row.append($ViewletSearchReplaceInput, $ButtonReplaceAll)
  return $Row
}

export const setReplaceExpanded = (state, replaceExpanded) => {
  console.log('set expanded', replaceExpanded)
  const { $ViewletSearchReplaceInput, $ToggleButton, $SearchField, $ViewletSearchInput } = state
  if (replaceExpanded) {
    $ToggleButton.ariaExpanded = true
    const $ViewletSearchReplaceInput = create$ReplaceField()
    $SearchField.after($ViewletSearchReplaceInput)
    state.$ViewletSearchReplaceInput = $ViewletSearchReplaceInput
    // TODO add it
  } else {
    $ToggleButton.ariaExpanded = false
    $ViewletSearchReplaceInput.remove()
    state.$ViewletSearchReplaceInput = undefined
    // TODO remove it
  }
}

export const setButtonsChecked = (state, matchWholeWord, useRegularExpression, matchCase) => {
  console.log({ matchWholeWord, useRegularExpression, matchCase })
  const { $ButtonMatchWholeWord, $ButtonUseRegularExpression, $ButtonMatchCase } = state
  $ButtonMatchWholeWord.ariaChecked = matchWholeWord
  $ButtonUseRegularExpression.ariaChecked = useRegularExpression
  $ButtonMatchCase.ariaChecked = matchCase
}

export * from '../ViewletScrollable/ViewletScrollable.js'
