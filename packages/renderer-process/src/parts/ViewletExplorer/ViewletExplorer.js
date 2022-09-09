import * as Assert from '../Assert/Assert.js'
import * as Focus from '../Focus/Focus.js' // TODO focus is never needed at start -> use command.execute which lazy-loads focus module
import * as InputBox from '../InputBox/InputBox.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as WheelEventType from '../WheelEventType/WheelEventType.js'
import * as DirentType from '../DirentType/DirentType.js'

export const name = 'Explorer'

const activeId = 'TreeItemActive'

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

const handleFocus = (event) => {
  Focus.setFocus('Explorer')
  const $Target = event.target
  if ($Target.className === 'InputBox') {
    return
  }
  event.preventDefault()
  RendererWorker.send(/* Explorer.focus */ 'Explorer.focus')
}

const handleBlur = (event) => {
  RendererWorker.send(/* Explorer.handleBlur */ 'Explorer.handleBlur')
}

const handleDragOver = (event) => {
  event.preventDefault()
  // state.element.classList.add('DropTarget')
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
  // state.element.classList.remove('DropTarget')
  event.preventDefault()
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

  // console.log(content)
}

// TODO maybe use aria active descendant instead
const getFocusedIndexFromFocusOutline = ($Viewlet) => {
  for (let i = 0; i < $Viewlet.children.length; i++) {
    const $Child = $Viewlet.children[i]
    if ($Child.classList.contains('FocusOutline')) {
      return i
    }
  }
  return -1
}

const handleContextMenuMouse = (event) => {
  const x = event.clientX
  const y = event.clientY
  RendererWorker.send(
    /* Explorer.handleContextMenuMouseAt */ 'Explorer.handleContextMenuMouseAt',
    /* x */ x,
    /* y */ y
  )
}

const handleContextMenuKeyboard = (event) => {
  RendererWorker.send(
    /* Explorer.handleContextMenuKeyboard */ 'Explorer.handleContextMenuKeyboard'
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

const handleMouseDown = (event) => {
  if (event.button !== MouseEventType.LeftClick) {
    return
  }
  const x = event.clientX
  const y = event.clientY
  RendererWorker.send(
    /* Explorer.handleClickAt */ 'Explorer.handleClickAt',
    /* x */ x,
    /* y */ y
  )
}

const handleMouseEnter = (event) => {
  // const $Target = event.target
  // const index = findIndex($Target)
  // if (index === -1) {
  //   return
  // }
  // RendererWorker.send(
  //   /* Explorer.handleMouseEnter */ 'Explorer.handleMouseEnter',
  //   /* index */ index
  // )
}

const handleMouseLeave = (event) => {
  // const $Target = event.target
  // const index = findIndex($Target)
  // if (index === -1) {
  //   return
  // }
  // RendererWorker.send(
  //   /* Explorer.handleMouseLeave */ 'Explorer.handleMouseLeave',
  //   /* index */ index
  // )
}

const handleWheel = (event) => {
  switch (event.deltaMode) {
    case WheelEventType.DomDeltaLine:
      RendererWorker.send(
        /* Explorer.handleWheel */ 'Explorer.handleWheel',
        /* deltaY */ event.deltaY
      )
      break
    case WheelEventType.DomDeltaPixel:
      RendererWorker.send(
        /* Explorer.handleWheel */ 'Explorer.handleWheel',
        /* deltaY */ event.deltaY
      )
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
  // @ts-ignore
  $Viewlet.role = 'tree'
  $Viewlet.ariaLabel = 'Files Explorer'
  $Viewlet.onmousedown = handleMouseDown
  $Viewlet.oncontextmenu = handleContextMenu
  // TODO use the other mouse events that capture automatically
  $Viewlet.addEventListener('mouseenter', handleMouseEnter, { capture: true })
  $Viewlet.addEventListener('mouseleave', handleMouseLeave, { capture: true })
  $Viewlet.addEventListener('wheel', handleWheel, { passive: true })
  $Viewlet.addEventListener('drop', handleDrop)
  $Viewlet.addEventListener('focus', handleFocus)
  $Viewlet.addEventListener('blur', handleBlur)
  return {
    $Viewlet,
  }
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

// TODO rename to renderDirent
const render$Row = ($Row, rowInfo) => {
  const $Icon = $Row.childNodes[0]
  const $LabelText = $Row.childNodes[1].childNodes[0]
  $Icon.className = `Icon${rowInfo.icon}`
  $LabelText.data = rowInfo.name
  $Row.title = rowInfo.path
  $Row.ariaSetSize = `${rowInfo.setSize}`
  // TODO bug with windows narrator
  // windows narrator reads heading level 1
  $Row.ariaLevel = `${rowInfo.depth}`
  $Row.ariaPosInSet = `${rowInfo.posInSet}`
  $Row.ariaLabel = rowInfo.name
  $Row.ariaDescription = ''
  switch (rowInfo.type) {
    // TODO decide on directory vs folder
    case DirentType.Directory:
      $Row.ariaExpanded = 'false'
      break
    case DirentType.DirectoryExpanding:
      $Row.ariaExpanded = 'true' // TODO tree should be aria-busy then
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

export const handleError = (state, message) => {
  Assert.object(state)
  Assert.string(message)
  state.$Viewlet.textContent = message
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
  switch (oldIndex) {
    case -2:
      break
    case -1:
      $Viewlet.classList.remove('FocusOutline')
      break
    default:
      const $Dirent = $Viewlet.children[oldIndex]
      if ($Dirent) {
        $Dirent.removeAttribute('id')
      }
      break
  }
  switch (newIndex) {
    case -2:
      $Viewlet.classList.remove('FocusOutline')
      $Viewlet.removeAttribute('aria-activedescendant')
      break
    case -1:
      $Viewlet.classList.add('FocusOutline')
      $Viewlet.removeAttribute('aria-activedescendant')
      $Viewlet.focus()
      break
    default:
      const $Dirent = $Viewlet.children[newIndex]
      $Dirent.id = activeId
      $Viewlet.focus()
      $Viewlet.setAttribute('aria-activedescendant', activeId)
      break
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
  const { $Viewlet } = state
  const $InputBox = InputBox.create()
  if (index === -1) {
    $Viewlet.append($InputBox)
  } else {
    const $Dirent = $Viewlet.children[index]
    // TODO this should never happen
    if (!$Dirent) {
      throw new Error(`dirent at index ${index} should be defined`)
    }
    $Dirent.before($InputBox)
  }
  $InputBox.focus()
  Focus.setFocus('ExplorerCreateFile')
}

export const hideCreateFileInputBox = (state, index) => {
  const { $Viewlet } = state
  if (index === -1) {
    const $InputBox = $Viewlet.lastChild
    $InputBox.remove()
    return $InputBox.value
  }
  const $InputBox = $Viewlet.children[index]
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
