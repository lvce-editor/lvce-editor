import * as Focus from '../Focus/Focus.js' // TODO focus is never needed at start -> use command.execute which lazy-loads focus module
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as FindIndex from '../../shared/findIndex.js'
import * as Assert from '../Assert/Assert.js'
import * as InputBox from '../InputBox/InputBox.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'

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

const handleFocus = (event) => {
  Focus.setFocus('Explorer')
  const $Target = event.target
  if ($Target.className === 'InputBox') {
    return
  }
  const index = findIndex($Target)
  if (index < 0) {
    return
  }
  event.preventDefault()
  RendererWorker.send(
    /* Explorer.focusIndex */ 'Explorer.focusIndex',
    /* index */ index
  )
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

const handleContextMenu = (event) => {
  event.preventDefault()
  const $Target = event.target
  const index = findIndex($Target)
  const x = event.clientX
  const y = event.clientY
  const button = event.button
  console.log({ button, x, y, pageX: event.pageX, pageY: event.pageY, event })
  if (event.button === MouseEventType.Keyboard) {
    console.log('is keyboard')
  }
  // const a = document.createElement('div')
  // a.style.position = 'fixed'
  // a.style.background = 'red'
  // a.style.height = '2px'
  // a.style.width = '2px'
  // a.style.left = x + 'px'
  // a.style.top = y + 'px'
  // document.body.append(a)
  RendererWorker.send(
    /* Explorer.handleContextMenu */ 'Explorer.handleContextMenu',
    /* x */ x,
    /* y */ y,
    /* index */ index,
    /* button */ button
  )
}

const handleMouseDown = (event) => {
  if (event.button !== MouseEventType.LeftClick) {
    return
  }
  const $Target = event.target
  const index = findIndex($Target)
  if (index === -2) {
    return
  }
  RendererWorker.send(
    /* Explorer.handleClick */ 'Explorer.handleClick',
    /* index */ index
  )
}

const findIndex = ($Target) => {
  if (
    $Target.className.includes('Icon') ||
    $Target.className.includes('TreeItemLabel')
  ) {
    return FindIndex.findIndex($Target.parentNode.parentNode, $Target)
  }
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
  RendererWorker.send(
    /* Explorer.handleMouseEnter */ 'Explorer.handleMouseEnter',
    /* index */ index
  )
}

const handleMouseLeave = (event) => {
  const $Target = event.target
  const index = findIndex($Target)
  if (index === -1) {
    return
  }
  RendererWorker.send(
    /* Explorer.handleMouseLeave */ 'Explorer.handleMouseLeave',
    /* index */ index
  )
}

const handleWheel = (event) => {
  switch (event.deltaMode) {
    case event.DOM_DELTA_LINE:
      RendererWorker.send(
        /* Explorer.handleWheel */ 'Explorer.handleWheel',
        /* deltaY */ event.deltaY
      )
      break
    case event.DOM_DELTA_PIXEL:
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
  $Row.childNodes[0].className = `Icon${rowInfo.icon}`
  $Row.childNodes[1].childNodes[0].data = rowInfo.name
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
    case 'directory':
    case 'folder':
      $Row.ariaExpanded = 'false'
      break
    case 'directory-expanding':
      $Row.ariaExpanded = 'true' // TODO tree should be aria-busy then
      break
    case 'directory-expanded':
      $Row.ariaExpanded = 'true'
      break
    case 'file':
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
        $Dirent.classList.remove('FocusOutline')
      }
      break
  }
  switch (newIndex) {
    case -2:
      $Viewlet.classList.remove('FocusOutline')
      break
    case -1:
      $Viewlet.classList.add('FocusOutline')
      $Viewlet.focus()
      break
    default:
      const $Dirent = $Viewlet.children[newIndex]
      $Dirent.classList.add('FocusOutline')
      $Viewlet.focus()
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
