import * as AriaRoles from '../AriaRoles/AriaRoles.js'
import * as Assert from '../Assert/Assert.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as InputBox from '../InputBox/InputBox.js'
import * as Label from '../Label/Label.js'
import * as MaskIcon from '../MaskIcon/MaskIcon.js'
import * as Icon from '../Icon/Icon.js'
import * as SearchResultType from '../SearchResultType/SearchResultType.js'
import * as ViewletSearchEvents from './ViewletSearchEvents.js'

// TODO name export not necessary
export const name = 'Search'

export const create = () => {
  const $ViewletSearchInput = InputBox.create()
  $ViewletSearchInput.placeholder = 'Search'
  $ViewletSearchInput.type = 'search'
  $ViewletSearchInput.enterKeyHint = 'search'
  $ViewletSearchInput.oninput = ViewletSearchEvents.handleInput
  $ViewletSearchInput.onfocus = ViewletSearchEvents.handleFocus

  const $SearchStatus = document.createElement('div')
  // @ts-ignore
  $SearchStatus.role = AriaRoles.Status
  $SearchStatus.className = 'ViewletSearchMessage'

  const $SearchHeader = document.createElement('div')
  $SearchHeader.className = 'SearchHeader'
  $SearchHeader.append($ViewletSearchInput, $SearchStatus)

  const $ListItems = document.createElement('div')
  $ListItems.className = 'ListItems'
  // TODO onclick vs onmousedown, should be consistent in whole application
  $ListItems.onmousedown = ViewletSearchEvents.handleClick
  $ListItems.oncontextmenu = ViewletSearchEvents.handleContextMenu
  $ListItems.onwheel = ViewletSearchEvents.handleWheel

  const $ScrollBarThumb = document.createElement('div')
  $ScrollBarThumb.className = 'ScrollBarThumb'

  const $ScrollBar = document.createElement('div')
  $ScrollBar.className = 'ScrollBarSmall'
  $ScrollBar.onpointerdown = ViewletSearchEvents.handleScrollBarPointerDown
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
  }
}

export const refresh = (state, context) => {
  Assert.object(state)
}

export const focus = (state) => {
  Assert.object(state)
  state.$ViewletSearchInput.focus()
}

const create$Row = () => {
  const $Label = Label.create('')
  const $Row = document.createElement('div')
  // @ts-ignore
  $Row.role = AriaRoles.TreeItem
  $Row.className = 'TreeItem'
  $Row.append($Label)
  return $Row
}

const render$RowDirectory = ($Row, rowInfo) => {
  const {
    top,
    type,
    matchStart,
    matchLength,
    text,
    title,
    icon,
    setSize,
    posInSet,
    depth,
  } = rowInfo
  if ($Row.children.length === 1) {
    const $Arrow = MaskIcon.create(Icon.ChevronDown)
    const $Icon = document.createElement('i')
    $Row.prepend($Arrow, $Icon)
  }
  const $Arrow = $Row.children[0]
  const $Icon = $Row.children[1]
  $Icon.className = `Icon${icon}`
  const $Label = $Row.lastChild
  $Label.textContent = text
}

const render$RowFile = ($Row, rowInfo) => {
  const { matchStart, matchLength, text } = rowInfo
  const $Label = $Row.lastChild
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
  if ($Row.children.length > 1) {
    $Row.replaceChildren($Label)
  }
}

// TODO much duplication with explorer
const render$Row = ($Row, rowInfo) => {
  const { top, type, title, setSize, posInSet, depth } = rowInfo
  $Row.title = title
  $Row.ariaSetSize = `${setSize}`
  $Row.ariaLevel = `${depth}`
  $Row.ariaPosInSet = `${posInSet}`
  $Row.ariaLabel = rowInfo.name
  $Row.ariaDescription = ''
  $Row.style.top = `${top}px`
  switch (type) {
    case SearchResultType.File:
      $Row.ariaExpanded = 'false'
      render$RowDirectory($Row, rowInfo)
      break
    case SearchResultType.File:
      $Row.ariaExpanded = 'true'
      render$RowDirectory($Row, rowInfo)
      break
    case SearchResultType.Preview:
      $Row.ariaExpanded = undefined
      render$RowFile($Row, rowInfo)
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
  $ListItems.style.height = `${height}px`
}

export const setNegativeMargin = (state, negativeMargin) => {
  const { $ListItems } = state
  $ListItems.style.top = `${negativeMargin}px`
}

export * from '../ViewletScrollable/ViewletScrollable.js'
