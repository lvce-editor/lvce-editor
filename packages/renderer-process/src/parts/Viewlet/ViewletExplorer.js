import * as Focus from '../Focus/Focus.js' // TODO focus is never needed at start -> use command.execute which lazy-loads focus module
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as FindIndex from '../../shared/findIndex.js'
import * as Assert from '../Assert/Assert.js'
import * as ActiveViewlet from './ActiveViewlet.js'
import * as InputBox from '../InputBox/InputBox.js'

export const name = 'Explorer'

// TODO put drop into separate module and use executeCommand to call it

// TODO drag and drop should be loaded on demand
const getAllEntries = async (dataTransfer) => {
  const topLevelEntries = Array.from(dataTransfer.items).map((item) =>
    item.webkitGetAsEntry()
  )
  const allEntries = await new Promise((resolve, reject) => {
    const result = []
    let finished = 0
    let total = 0

    const fileCallback = (file) => {
      finished++
      result.push({
        type: 1,
        // path: entry.fullPath,
        file,
      })
      if (finished === total) {
        resolve(result)
      }
    }

    const handleEntryFile = (entry) => {
      entry.file(fileCallback)
    }

    const entriesCallback = (childEntries) => {
      handleEntries(childEntries)
      finished++
      if (finished === total) {
        resolve(result)
      }
    }

    const handleEntryDirectory = (entry) => {
      result.push({
        type: 2,
        path: entry.fullPath,
      })
      const dirReader = entry.createReader()
      dirReader.readEntries(entriesCallback)
    }

    const handleEntries = (entries) => {
      total += entries.length
      for (const entry of entries) {
        if (entry.isFile) {
          handleEntryFile(entry)
        } else if (entry.isDirectory) {
          handleEntryDirectory(entry)
        } else {
        }
      }
    }

    handleEntries(topLevelEntries)
  })
  return allEntries
}

const handleFocusIn = () => {
  Focus.setFocus('Explorer')
}

const handleDragOver = (event) => {
  const state = ActiveViewlet.getStateFromEvent(event)
  event.preventDefault()
  state.element.classList.add('DropTarget')
}

const handleDragStart = (event) => {
  event.dataTransfer.dropEffect = 'copy'
  // event.dataTransfer.setData('DownloadURL', '/tmp/some-file.txt')
  // event.preventDefault()
  event.dataTransfer.setData('text/uri-list', 'https://example.com/foobar')
  // event.dataTransfer.setData('x-special/nautilus-clipboard', 'hello-world')
  // event.dataTransfer.setData('text/plain', 'abc')
}

const handleDrop = async (event) => {
  console.log('DROP')
  const state = ActiveViewlet.getStateFromEvent(event)
  state.element.classList.remove('DropTarget')
  event.preventDefault()
  console.log(event.dataTransfer.items)
  console.log('FILES', event.dataTransfer.files)
  const allEntries = await getAllEntries(event.dataTransfer)
  const firstEntry = allEntries[0]
  if (!firstEntry) {
    return console.warn('no entries')
  }
  // const reader = new FileReader()
  // reader.onload = (event) => {
  //   console.log(reader.result)
  // }
  // const text = reader.readAsArrayBuffer(firstEntry)
  // console.log(allEntries)
  // const content = await new Promise((resolve, reject) => {
  //   const reader = new FileReader()
  //   reader.onload = (event) => {
  //     console.log(event)
  //     resolve(reader.result)
  //   }
  //   reader.onerror = (event) => {
  //     reject(event)
  //   }
  //   reader.readAsArrayBuffer(firstEntry.file)
  // })
  // RendererWorker.send()
  // const content = await firstEntry.file.text()
  // console.log(event.dataTransfer)
  console.log('ENTRIES', allEntries)

  // console.log(content)
}

const handleContextMenu = (event) => {
  event.preventDefault()
  const $Target = event.target
  const index = findIndex($Target)
  const x = event.clientX
  const y = event.clientY
  RendererWorker.send([
    /* Explorer.handleContextMenu */ 'Explorer.handleContextMenu',
    /* x */ x,
    /* y */ y,
    /* index */ index,
  ])
}

const handleMouseDown = (event) => {
  if (event.button !== /* LeftClick */ 0) {
    return
  }
  const $Target = event.target
  const index = findIndex($Target)
  if (index === -2) {
    return
  }
  event.preventDefault()
  RendererWorker.send([
    /* Explorer.handleClick */ 'Explorer.handleClick',
    /* index */ index,
  ])
}

const findIndex = ($Target) => {
  if ($Target.classList.contains('TreeItem')) {
    return FindIndex.findIndex($Target.parentNode, $Target)
  }
  if ($Target.classList.contains('Viewlet')) {
    return -1
  }
  return -2
}

const handleMouseEnter = (event) => {
  const $Target = event.target
  const index = findIndex($Target)
  if (index === -1) {
    return
  }
  RendererWorker.send([
    /* Explorer.handleMouseEnter */ 'Explorer.handleMouseEnter',
    /* index */ index,
  ])
}

const handleMouseLeave = (event) => {
  const $Target = event.target
  const index = findIndex($Target)
  if (index === -1) {
    return
  }
  RendererWorker.send([
    /* Explorer.handleMouseLeave */ 'Explorer.handleMouseLeave',
    /* index */ index,
  ])
}

const handleWheel = (event) => {
  switch (event.deltaMode) {
    case event.DOM_DELTA_LINE:
      RendererWorker.send([
        /* Explorer.handleWheel */ 'Explorer.handleWheel',
        /* deltaY */ event.deltaY,
      ])
      break
    case event.DOM_DELTA_PIXEL:
      RendererWorker.send([
        /* Explorer.handleWheel */ 'Explorer.handleWheel',
        /* deltaY */ event.deltaY,
      ])
      break
    default:
      break
  }
}

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet'
  $Viewlet.tabIndex = 0
  $Viewlet.dataset.viewletId = 'Explorer'
  $Viewlet.setAttribute('role', 'tree')
  $Viewlet.ariaLabel = 'Files Explorer'
  $Viewlet.onmousedown = handleMouseDown
  $Viewlet.oncontextmenu = handleContextMenu
  $Viewlet.addEventListener('mouseenter', handleMouseEnter, { capture: true })
  $Viewlet.addEventListener('mouseleave', handleMouseLeave, { capture: true })
  $Viewlet.addEventListener('wheel', handleWheel, { passive: true })
  $Viewlet.addEventListener('drop', handleDrop)
  $Viewlet.addEventListener('focusin', handleFocusIn)
  return {
    $Viewlet,
  }
}

const create$Row = () => {
  const $Row = document.createElement('div')
  $Row.setAttribute('role', 'treeitem')
  $Row.className = 'TreeItem'
  return $Row
}

// TODO rename to renderDirent
const render$Row = ($Row, rowInfo) => {
  $Row.textContent = rowInfo.name
  $Row.title = rowInfo.path
  $Row.tabIndex = -1
  $Row.ariaSetSize = `${rowInfo.setSize}`
  // TODO bug with windows narrator
  // windows narrator reads heading level 1
  $Row.ariaLevel = `${rowInfo.depth}`
  $Row.ariaPosInSet = `${rowInfo.posInSet}`
  $Row.ariaLabel = rowInfo.name
  $Row.ariaDescription = ''
  switch (rowInfo.type) {
    // TODO decide on directory vs folder
    case 'directory':
    case 'folder':
      $Row.ariaExpanded = 'false'
      $Row.className = `TreeItem Icon${rowInfo.icon}`
      break
    case 'directory-expanding':
      $Row.className = `TreeItem Icon${rowInfo.icon}`
      $Row.ariaExpanded = 'true' // TODO tree should be aria-busy then
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
      // console.log({ rowInfo })
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

export const handleError = (state, message) => {
  Assert.object(state)
  Assert.string(message)
  console.log('HANDLE ERROR 2', { message })
  state.$Viewlet.textContent = message
  console.log(state.$Viewlet)
}

export const updateDirents = (state, dirents) => {
  Assert.object(state)
  Assert.array(dirents)
  render$Rows(state.$Viewlet, dirents)
}

export const setFocusedIndex = (state, oldIndex, newIndex) => {
  Assert.object(state)
  Assert.number(oldIndex)
  Assert.number(newIndex)
  const { $Viewlet } = state
  if (oldIndex === -1) {
    $Viewlet.classList.remove('FocusOutline')
  }
  if (newIndex === -1) {
    $Viewlet.classList.add('FocusOutline')
    $Viewlet.focus()
  } else {
    const $Dirent = $Viewlet.children[newIndex]
    $Dirent.focus()
  }
}

export const dispose = (state) => {}

export const hoverIndex = (state, oldIndex, newIndex) => {
  Assert.object(state)
  Assert.number(oldIndex)
  Assert.number(newIndex)
  if (oldIndex !== -1) {
    const $OldItem = state.$Viewlet.children[oldIndex]
    $OldItem.classList.remove('Hover')
  }
  const $NewItem = state.$Viewlet.children[newIndex]
  $NewItem.classList.add('Hover')
}

export const showCreateFileInputBox = (state, index) => {
  const $InputBox = InputBox.create()
  const $Dirent = state.$Viewlet.children[index]
  $Dirent.before($InputBox)
  $InputBox.focus()
  Focus.setFocus('ExplorerCreateFile')
}

export const hideCreateFileInputBox = (state, index) => {
  const $InputBox = state.$Viewlet.children[index]
  $InputBox.remove()
  return $InputBox.value
}

export const showRenameInputBox = (state, index, name) => {
  const $InputBox = InputBox.create()
  $InputBox.value = name
  const $Dirent = state.$Viewlet.children[index]
  $Dirent.replaceWith($InputBox)
  $InputBox.select()
  $InputBox.setSelectionRange(0, $InputBox.value.length)
  Focus.setFocus('ExplorerRename')
}

export const hideRenameBox = (state, index, dirent) => {
  const $InputBox = state.$Viewlet.children[index]
  const $Dirent = create$Row()
  render$Row($Dirent, dirent)
  $InputBox.replaceWith($Dirent)
  // $Dirent.focus()
  return $InputBox.value
}
