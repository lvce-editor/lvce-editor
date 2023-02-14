import * as AllowedDragEffectType from '../AllowedDragEffectType/AllowedDragEffectType.js'
import * as DataTransfer from '../DataTransfer/DataTransfer.js'
import * as DropEffectType from '../DropEffectType/DropEffectType.js'
import * as Event from '../Event/Event.js'
import * as Focus from '../Focus/Focus.js' // TODO focus is never needed at start -> use command.execute which lazy-loads focus module
import * as GetFileHandlesFromDataTransferItems from '../GetFileHandlesFromDataTransferItems/GetFileHandlesFromDataTransferItems.js'
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as Platform from '../Platform/Platform.js'
import * as WheelEventType from '../WheelEventType/WheelEventType.js'
import * as ViewletExplorerFunctions from './ViewletExplorerFunctions.js'

// TODO put drop into separate module and use executeCommand to call it

// TODO drag and drop should be loaded on demand
const getAllEntries = async (dataTransfer) => {
  const topLevelEntries = Array.from(dataTransfer.items).map((item) => item.webkitGetAsEntry())
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

export const handleFocus = (event) => {
  const { target, isTrusted } = event
  Focus.setFocus('Explorer')
  if (!isTrusted || target.className === 'InputBox') {
    return
  }
  ViewletExplorerFunctions.focus()
}

export const handleBlur = (event) => {
  ViewletExplorerFunctions.handleBlur()
}

/**
 *
 * @param {DragEvent} event
 */
export const handleDragOver = (event) => {
  Event.preventDefault(event)
  const { dataTransfer, clientX, clientY } = event
  DataTransfer.setEffectAllowed(dataTransfer, AllowedDragEffectType.CopyMove)
  DataTransfer.setDropEffect(dataTransfer, DropEffectType.Copy)
  ViewletExplorerFunctions.handleDragOver(clientX, clientY)
}

/**
 * @param {DragEvent} event
 */
export const handleDragStart = (event) => {
  const { target, dataTransfer } = event
  if (!(target instanceof HTMLElement)) {
    return
  }
  const filePath = target.title
  const fileName = target.textContent
  DataTransfer.setEffectAllowed(dataTransfer, AllowedDragEffectType.CopyMove)
  DataTransfer.setFilePath(dataTransfer, filePath, fileName)
}

/**
 *
 * @param {DragEvent} event
 */
export const handleDrop = async (event) => {
  Event.preventDefault(event)
  Event.stopPropagation(event)
  const { files, dropEffect, items } = event.dataTransfer
  const { clientX, clientY } = event
  if (Platform.isElectron()) {
    ViewletExplorerFunctions.handleDrop(clientX, clientY, files)
  } else {
    // unfortunately, DataTransferItem cannot be transferred to web worker
    // therefore the file system handles are sent to the web worker
    const handles = await GetFileHandlesFromDataTransferItems.getFileHandles(items)
    ViewletExplorerFunctions.handleDrop(clientX, clientY, handles)
  }
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

export const handleContextMenu = (event) => {
  event.preventDefault()
  const { button, clientX, clientY } = event
  ViewletExplorerFunctions.handleContextMenu(button, clientX, clientY)
}

export const handleClick = (event) => {
  const { button, clientX, clientY } = event
  if (button !== MouseEventType.LeftClick) {
    return
  }
  ViewletExplorerFunctions.handleClickAt(clientX, clientY)
}

export const handleWheel = (event) => {
  const { deltaMode, deltaY } = event
  switch (deltaMode) {
    case WheelEventType.DomDeltaLine:
    case WheelEventType.DomDeltaPixel:
      ViewletExplorerFunctions.handleWheel(deltaY)
      break
    default:
      break
  }
}

export const handleMouseEnter = (event) => {
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

export const handleMouseLeave = (event) => {
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

export const handleEditingInput = (event) => {
  const { target } = event
  const { value } = target
  ViewletExplorerFunctions.updateEditingValue(value)
}
