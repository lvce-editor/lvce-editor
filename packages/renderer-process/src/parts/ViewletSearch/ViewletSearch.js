import * as Assert from '../Assert/Assert.js'
import * as DirentType from '../DirentType/DirentType.js'
import * as InputBox from '../InputBox/InputBox.js'
import * as ViewletSearchEvents from './ViewletSearchEvents.js'
import * as Label from '../Label/Label.js'

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
  $SearchStatus.role = 'status'
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
  const $Row = document.createElement('div')
  // @ts-ignore
  $Row.role = 'treeitem'
  $Row.className = 'TreeItem'
  const $Label = Label.create('')
  const $Icon = document.createElement('i')
  $Row.append($Icon, $Label)
  return $Row
}

// TODO much duplication with explorer
const render$Row = ($Row, rowInfo) => {
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
  const $Icon = $Row.childNodes[0]
  const $Label = $Row.childNodes[1]
  $Icon.className = `Icon${icon}`
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
  $Row.style.top = `${top}px`
  switch (type) {
    // TODO type should be a number for efficiency
    case DirentType.Directory:
      $Row.ariaExpanded = 'false'
      break
    case DirentType.DirectoryExpanded:
      $Row.ariaExpanded = 'true'
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
  $ListItems.style.height = `${height}px`
}

export const setNegativeMargin = (state, negativeMargin) => {
  const { $ListItems } = state
  $ListItems.style.top = `${negativeMargin}px`
}

export * from '../ViewletScrollable/ViewletScrollable.js'
