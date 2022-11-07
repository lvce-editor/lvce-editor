/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.js'

beforeAll(() => {
  // Workaround for drag event not being implemented in jsdom https://github.com/jsdom/jsdom/issues/2913
  // @ts-ignore
  globalThis.DragEvent = class extends Event {
    constructor(type, options) {
      super(type, options)
      // @ts-ignore
      this.dataTransfer = options.dataTransfer || {}
      // @ts-ignore
      this.dataTransfer.setData ||= () => {}
      // @ts-ignore
      this.dataTransfer.items ||= []
      this.dataTransfer.files ||= []
      this.clientX = options.clientX ?? 0
      this.clientY = options.clientY ?? 0
    }
  }
})

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RendererWorker/RendererWorker.js',
  () => {
    return {
      send: jest.fn(() => {}),
    }
  }
)
jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    isElectron: () => {
      return true
    },
  }
})

const RendererWorker = await import(
  '../src/parts/RendererWorker/RendererWorker.js'
)

const ViewletExplorer = await import(
  '../src/parts/ViewletExplorer/ViewletExplorer.js'
)
const ViewletExplorerEvents = await import(
  '../src/parts/ViewletExplorer/ViewletExplorerEvents.js'
)

test('event - contextmenu', () => {
  const state = ViewletExplorer.create()
  ViewletExplorer.updateDirents(state, [
    {
      name: '.gitkeep',
      depth: 1,
      type: DirentType.File,
      path: '/.gitkeep',
      setSize: 5,
      posInSet: 1,
    },
    {
      name: 'another-folder',
      depth: 1,
      type: DirentType.Directory,
      path: '/another-folder',
      setSize: 5,
      posInSet: 2,
    },
    {
      name: 'index.css',
      depth: 1,
      type: DirentType.File,
      path: '/index.css',
      setSize: 5,
      posInSet: 3,
    },
    {
      name: 'index.html',
      depth: 1,
      type: DirentType.File,
      path: '/index.html',
      setSize: 5,
      posInSet: 4,
    },
    {
      name: 'nested',
      depth: 1,
      type: DirentType.Directory,
      path: '/nested',
      setSize: 5,
      posInSet: 5,
    },
  ])
  // @ts-ignore
  const $GitKeep = state.$Viewlet.children[0]
  $GitKeep.dispatchEvent(
    new MouseEvent('contextmenu', {
      clientX: 50,
      clientY: 50,
      bubbles: true,
      button: 2,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'Explorer.handleContextMenuMouseAt',
    50,
    50
  )
})

test('event - contextmenu - activated via keyboard', () => {
  const state = ViewletExplorer.create()
  ViewletExplorer.updateDirents(state, [
    {
      name: 'index.css',
      depth: 1,
      type: DirentType.File,
      path: '/index.css',
      setSize: 1,
      posInSet: 1,
    },
  ])
  ViewletExplorer.setFocusedIndex(state, -1, 0)
  // @ts-ignore
  state.$Viewlet.children[0].getBoundingClientRect = () => {
    return {
      x: 100,
      y: 200,
      height: 20,
    }
  }
  state.$Viewlet.dispatchEvent(
    new MouseEvent('contextmenu', {
      clientX: 50,
      clientY: 50,
      bubbles: true,
      button: -1,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'Explorer.handleContextMenuKeyboard'
  )
})

// TODO test expand/collapse

// TODO test focus

test('event - click', () => {
  const state = ViewletExplorer.create()
  ViewletExplorer.updateDirents(state, [
    {
      name: '.gitkeep',
      depth: 1,
      type: DirentType.File,
      path: '/.gitkeep',
      setSize: 5,
      posInSet: 1,
    },
    {
      name: 'another-folder',
      depth: 1,
      type: DirentType.Directory,
      path: '/another-folder',
      setSize: 5,
      posInSet: 2,
    },
    {
      name: 'index.css',
      depth: 1,
      type: DirentType.File,
      path: '/index.css',
      setSize: 5,
      posInSet: 3,
    },
    {
      name: 'index.html',
      depth: 1,
      type: DirentType.File,
      path: '/index.html',
      setSize: 5,
      posInSet: 4,
    },
    {
      name: 'nested',
      depth: 1,
      type: DirentType.Directory,
      path: '/nested',
      setSize: 5,
      posInSet: 5,
    },
  ])
  const $GitKeep = state.$Viewlet.children[0]
  const event = new MouseEvent('mousedown', {
    clientX: 50,
    clientY: 50,
    bubbles: true,
    button: 0,
    cancelable: true,
  })
  $GitKeep.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'Explorer.handleClickAt',
    50,
    50
  )
  expect(event.defaultPrevented).toBe(false)
})

test('event - click on wrapper div', () => {
  const state = ViewletExplorer.create()
  ViewletExplorer.updateDirents(state, [
    {
      name: 'index.css',
      depth: 1,
      type: DirentType.File,
      path: '/index.css',
    },
    {
      name: 'index.html',
      depth: 1,
      type: DirentType.File,
      path: '/index.html',
    },
  ])
  const event = new MouseEvent('mousedown', {
    clientX: 50,
    clientY: 50,
    bubbles: true,
    button: 0,
  })
  state.$Viewlet.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'Explorer.handleClickAt',
    50,
    50
  )
})

test('event - right click', () => {
  const state = ViewletExplorer.create()
  ViewletExplorer.updateDirents(state, [
    {
      name: '.gitkeep',
      depth: 1,
      type: DirentType.File,
      path: '/.gitkeep',
    },
    {
      name: 'another-folder',
      depth: 1,
      type: DirentType.Directory,
      path: '/another-folder',
    },
    {
      name: 'index.css',
      depth: 1,
      type: DirentType.File,
      path: '/index.css',
    },
    {
      name: 'index.html',
      depth: 1,
      type: DirentType.File,
      path: '/index.html',
    },
    {
      name: 'nested',
      depth: 1,
      type: DirentType.Directory,
      path: '/nested',
    },
  ])
  const $GitKeep = state.$Viewlet.children[0]
  const event = new MouseEvent('mousedown', {
    clientX: 50,
    clientY: 50,
    bubbles: true,
    button: 1,
  })
  $GitKeep.dispatchEvent(event)
  expect(RendererWorker.send).not.toHaveBeenCalled()
})

test('event - blur', () => {
  const state = ViewletExplorer.create()
  ViewletExplorer.updateDirents(state, [
    {
      name: '.gitkeep',
      depth: 1,
      type: DirentType.File,
      path: '/.gitkeep',
    },
    {
      name: 'another-folder',
      depth: 1,
      type: DirentType.Directory,
      path: '/another-folder',
    },
    {
      name: 'index.css',
      depth: 1,
      type: DirentType.File,
      path: '/index.css',
    },
    {
      name: 'index.html',
      depth: 1,
      type: DirentType.File,
      path: '/index.html',
    },
    {
      name: 'nested',
      depth: 1,
      type: DirentType.Directory,
      path: '/nested',
    },
  ])
  const $GitKeep = state.$Viewlet.children[0]
  const event = new FocusEvent('blur', {
    bubbles: true,
  })
  $GitKeep.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith('Explorer.handleBlur')
})

test('event - dragStart', () => {
  const state = ViewletExplorer.create()
  ViewletExplorer.updateDirents(state, [
    {
      name: 'file-1.txt',
      depth: 1,
      setSize: 1,
      type: DirentType.File,
      path: '/test/file-1.txt',
    },
  ])
  const $File1 = state.$Viewlet.children[0]
  const event = new DragEvent('dragstart', {
    bubbles: true,
  })
  const spy = jest.spyOn(event.dataTransfer, 'setData')
  $File1.dispatchEvent(event)
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(
    'text/uri-list',
    'https://example.com/foobar'
  )
  expect(event.dataTransfer.effectAllowed).toBe('copyMove')
})

test('event - dragover', () => {
  const state = ViewletExplorer.create()
  ViewletExplorer.updateDirents(state, [
    {
      name: 'file-1.txt',
      depth: 1,
      setSize: 1,
      type: DirentType.File,
      path: '/test/file-1.txt',
    },
  ])
  const $File1 = state.$Viewlet.children[0]
  const event = new DragEvent('dragover', {
    bubbles: true,
    cancelable: true,
    clientX: 10,
    clientY: 20,
  })
  $File1.dispatchEvent(event)
  expect(event.defaultPrevented).toBe(true)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'Explorer.handleDragOver',
    10,
    20
  )
})

test('event - drop', () => {
  const state = ViewletExplorer.create()
  ViewletExplorer.updateDirents(state, [
    {
      name: 'file-1.txt',
      depth: 1,
      setSize: 1,
      type: DirentType.File,
      path: '/test/file-1.txt',
    },
  ])
  const $File1 = state.$Viewlet.children[0]
  const modifiedDate = new Date()
  const event = new DragEvent('drop', {
    bubbles: true,
    cancelable: true,
    // @ts-ignore
    dataTransfer: {
      files: [
        {
          lastModified: 0,
          // @ts-ignore
          lastModifiedDate: modifiedDate,
          name: 'file.json',
          path: '/test/file.json',
          size: 756705,
          type: 'application/json',
          webkitRelativePath: '',
        },
      ],
    },
  })
  const stopProgationSpy = jest.spyOn(event, 'stopPropagation')
  $File1.dispatchEvent(event)
  expect(event.defaultPrevented).toBe(true)
  expect(stopProgationSpy).toHaveBeenCalled()
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'Explorer.handleDrop',
    0,
    0,
    [
      {
        lastModified: 0,
        lastModifiedDate: modifiedDate,
        name: 'file.json',
        path: '/test/file.json',
        size: 756705,
        type: 'application/json',
        webkitRelativePath: '',
      },
    ]
  )
})

test('event - input on rename input box', () => {
  const state = ViewletExplorer.create()
  const { $Viewlet } = state
  ViewletExplorer.updateDirents(state, [
    {
      name: 'file-1',
      depth: 1,
      type: DirentType.File,
      path: '/file-1',
      setSize: 2,
      posInSet: 1,
    },
    {
      name: 'folder-2',
      depth: 1,
      type: DirentType.Directory,
      path: '/folder-2',
      setSize: 2,
      posInSet: 2,
    },
  ])
  ViewletExplorer.showEditBox(state, 0, 'file-1')
  expect($Viewlet.children).toHaveLength(2)
  const $InputBox = $Viewlet.children[0].children[1]
  // @ts-ignore
  $InputBox.value = 'file-3'
  $InputBox.dispatchEvent(
    new InputEvent('input', {
      bubbles: true,
      cancelable: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'Explorer.updateEditingValue',
    'file-3'
  )
})
