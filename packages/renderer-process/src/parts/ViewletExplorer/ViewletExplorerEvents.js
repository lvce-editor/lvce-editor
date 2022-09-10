import * as Focus from '../Focus/Focus.js' // TODO focus is never needed at start -> use command.execute which lazy-loads focus module
import * as MouseEventType from '../MouseEventType/MouseEventType.js'
import * as RendererWorker from '../RendererWorker/RendererWorker.js'
import * as WheelEventType from '../WheelEventType/WheelEventType.js'

// TODO put drop into separate module and use executeCommand to call it

// TODO drag and drop should be loaded on demand
const getAllEntries = async (dataTransfer) => {
  console.log({ dataTransfer })
  const topLevelEntries = Array.from(dataTransfer.items).map((item) =>
    item.webkitGetAsEntry()
  )
  console.log({ topLevelEntries })
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
  console.log('promise finished')
  return allEntries
}

export const handleFocus = (event) => {
  Focus.setFocus('Explorer')
  const $Target = event.target
  if ($Target.className === 'InputBox') {
    return
  }
  event.preventDefault()
  RendererWorker.send(/* Explorer.focus */ 'Explorer.focus')
}

export const handleBlur = (event) => {
  RendererWorker.send(/* Explorer.handleBlur */ 'Explorer.handleBlur')
}

/**
 *
 * @param {DragEvent} event
 */
export const handleDragOver = (event) => {
  event.preventDefault()
  // state.element.classList.add('DropTarget')
}

/**
 * @param {DragEvent} event
 */
export const handleDragStart = (event) => {
  console.log('call setData')
  // event.dataTransfer.dropEffect = 'copy'
  event.dataTransfer.effectAllowed = 'copyMove'
  // event.dataTransfer.setData('DownloadURL', '/tmp/some-file.txt')
  // event.preventDefault()
  event.dataTransfer.setData('text/uri-list', 'https://example.com/foobar')
  // event.dataTransfer.setData('x-special/nautilus-clipboard', 'hello-world')
  // event.dataTransfer.setData('text/plain', 'abc')
}

/**
 *
 * @param {DragEvent} event
 */
export const handleDrop = async (event) => {
  console.log('[explorer] drop', event)
  // state.element.classList.remove('DropTarget')
  event.preventDefault()
  const { files, dropEffect } = event.dataTransfer
  console.log({ files, dropEffect })
  RendererWorker.send('Explorer.handleDrop', files)
  // const allEntries = await getAllEntries(event.dataTransfer)
  // const firstEntry = allEntries[0]
  // if (!firstEntry) {
  //   return console.warn('no entries')
  // }
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
  switch (event.button) {
    case MouseEventType.Keyboard:
      return handleContextMenuKeyboard(event)
    default:
      return handleContextMenuMouse(event)
  }
}

export const handleMouseDown = (event) => {
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

export const handleWheel = (event) => {
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
