import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as InputBox from '../InputBox/InputBox.js'
import * as Assert from '../Assert/Assert.js'

const handleInput = (event) => {
  const $Target = event.target
  const value = $Target.value
  RendererWorker.send(/* ViewletSearch.handleInput */ 9444, /* value */ value)
}

const getNodeIndex = ($Node) => {
  let index = 0
  while (($Node = $Node.previousElementSibling)) {
    index++
  }
  return index
}

const handleClick = (event) => {
  const $Target = event.target
  switch ($Target.className) {
    case 'TreeItem':
      const index = getNodeIndex($Target)
      RendererWorker.send(
        /* ViewletSearch.handleClick */ 9445,
        /* index */ index
      )
      break
    default:
      break
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
  $SearchResults.onclick = handleClick

  const $SearchStatus = document.createElement('div')
  $SearchStatus.setAttribute('role', 'status')

  const $Viewlet = document.createElement('div')
  $Viewlet.dataset.viewletId = 'Search'
  $Viewlet.tabIndex = -1
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
  $Row.setAttribute('role', 'treeitem')
  $Row.className = 'TreeItem'
  return $Row
}

// TODO much duplication with explorer
const render$Row = ($Row, rowInfo) => {
  $Row.textContent = rowInfo.name
  $Row.title = rowInfo.path
  $Row.tabIndex = -1
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

const cleanNode = ($Node) => {
  while ($Node.firstChild) {
    $Node.firstChild.remove()
  }
}

const getStatusMessage = (resultCount, fileResultCount) => {
  if (resultCount === 0) {
    return 'No results found'
  }
  if (resultCount === 1 && fileResultCount === 1) {
    return `Found 1 result in 1 file`
  }
  if (fileResultCount === 1) {
    return `Found ${resultCount} results in 1 file`
  }
  return `Found ${resultCount} results in ${fileResultCount} files`
}

export const setResults = (state, results, resultCount, fileResultCount) => {
  Assert.object(state)
  Assert.array(results)
  // TODO should recycle nodes when rendering only search results
  // maybe could also recycle node from noResults and vice versa
  const statusMessage = getStatusMessage(resultCount, fileResultCount)
  state.$SearchStatus.textContent = statusMessage
  render$Rows(state.$SearchResults, results)
}

export const dispose = () => {}
