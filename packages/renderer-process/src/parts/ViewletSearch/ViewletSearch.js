import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as InputBox from '../InputBox/InputBox.js'
import * as Assert from '../Assert/Assert.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'

const handleInput = (event) => {
  const $Target = event.target
  const value = $Target.value
  RendererWorker.send(
    /* ViewletSearch.handleInput */ 'Search.handleInput',
    /* value */ value
  )
}

const getNodeIndex = ($Node) => {
  let index = 0
  while (($Node = $Node.previousElementSibling)) {
    index++
  }
  return index
}

const handleClickTreeItem = ($Target) => {
  const index = getNodeIndex($Target)
  RendererWorker.send(
    /* Search.handleClick */ 'Search.handleClick',
    /* index */ index
  )
}

const handleClickTreeItemLabel = ($Target) => {
  return handleClickTreeItem($Target.parentNode)
}

const handleClick = (event) => {
  const $Target = event.target
  switch ($Target.className) {
    case 'TreeItem':
      return handleClickTreeItem($Target)
    case 'TreeItemLabel':
      return handleClickTreeItemLabel($Target)
    default:
      break
  }
}

const handleContextMenuMouse = (event) => {
  const x = event.clientX
  const y = event.clientY
  RendererWorker.send(
    /* Search.handleContextMenuMouse */ 'Search.handleContextMenuMouse',
    /* x */ x,
    /* y */ y
  )
}

const handleContextMenuKeyboard = (event) => {
  RendererWorker.send(
    /* Search.handleContextMenuKeyboard */ 'Search.handleContextMenuKeyboard'
  )
}

const handleContextMenu = (event) => {
  event.preventDefault()
  switch (event.button) {
    case MouseEventType.Keyboard:
      return handleContextMenuKeyboard(event)
    default:
      return handleContextMenuMouse(event)
  }
}

// TODO name export not necessary
export const name = 'Search'

export const create = () => {
  const $ViewletSearchInput = InputBox.create()
  $ViewletSearchInput.placeholder = 'Search'
  $ViewletSearchInput.oninput = handleInput
  $ViewletSearchInput.className = 'InputBox ViewletSearchInput'

  const $SearchResults = document.createElement('div')
  $SearchResults.className = 'SearchResults'
  // TODO onclick vs onmousedown, should be consistent in whole application
  $SearchResults.onmousedown = handleClick
  $SearchResults.oncontextmenu = handleContextMenu

  const $SearchStatus = document.createElement('div')
  // @ts-ignore
  $SearchStatus.role = 'status'
  $SearchStatus.className = 'ViewletSearchMessage'

  const $Viewlet = document.createElement('div')
  $Viewlet.dataset.viewletId = 'Search'
  $Viewlet.className = 'Viewlet'
  $Viewlet.append($ViewletSearchInput, $SearchStatus, $SearchResults)

  return {
    $Viewlet,
    $ViewletSearchInput,
    $SearchResults,
    $SearchStatus,
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
  const $LabelText = document.createTextNode('')
  const $Label = document.createElement('div')
  $Label.className = 'TreeItemLabel'
  $Label.append($LabelText)
  const $Icon = document.createElement('i')
  $Row.append($Icon, $Label)
  return $Row
}

// TODO much duplication with explorer
const render$Row = ($Row, rowInfo) => {
  const $Icon = $Row.childNodes[0]
  const $LabelText = $Row.childNodes[1].childNodes[0]
  $Icon.className = `Icon${rowInfo.icon}`
  $LabelText.data = rowInfo.text
  $Row.title = rowInfo.title
  $Row.ariaSetSize = `${rowInfo.setSize}`
  $Row.ariaLevel = `${rowInfo.depth}`
  $Row.ariaPosInSet = `${rowInfo.posInSet}`
  $Row.ariaLabel = rowInfo.name
  $Row.ariaDescription = ''
  switch (rowInfo.type) {
    // TODO type should be a number for efficiency
    case 'directory':
    case 'folder':
      $Row.ariaExpanded = 'false'
      $Row.className = `TreeItem Icon${rowInfo.icon}`
      break
    case 'directory-expanded':
      $Row.className = `TreeItem Icon${rowInfo.icon}`
      $Row.ariaExpanded = 'true'
      break
    case 'file':
      $Row.ariaExpanded = undefined
      $Row.className = `TreeItem Icon${rowInfo.icon}`
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
  // TODO should recycle nodes when rendering only search results
  // maybe could also recycle node from noResults and vice versa
  render$Rows(state.$SearchResults, results)
}

export const setMessage = (state, message) => {
  const { $SearchStatus } = state
  // TODO recycle text node
  $SearchStatus.textContent = message
}

export const dispose = () => {}
