/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RendererWorker/RendererWorker.js',
  () => {
    return {
      send: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const RendererWorker = await import(
  '../src/parts/RendererWorker/RendererWorker.js'
)

const ViewletExplorer = await import('../src/parts/Viewlet/ViewletExplorer.js')

const getSimpleList = (state) => {
  return Array.from(state.$Viewlet.children).map((node) => node.textContent)
}

test('name', () => {
  expect(ViewletExplorer.name).toBe('Explorer')
})

test('create', () => {
  const state = ViewletExplorer.create()
  expect(state).toBeDefined()
})

test('dispose', () => {
  const state = ViewletExplorer.create()
  ViewletExplorer.dispose(state)
})

test('handleError', () => {
  const state = ViewletExplorer.create()
  ViewletExplorer.handleError(state, 'Error: Oops')
  expect(state.$Viewlet.textContent).toBe('Error: Oops')
})

test('updateDirents', () => {
  const state = ViewletExplorer.create()
  ViewletExplorer.updateDirents(state, [
    {
      name: '.gitkeep',
      depth: 1,
      type: 'file',
      path: '/.gitkeep',
      setSize: 5,
      posInSet: 1,
    },
    {
      name: 'another-folder',
      depth: 1,
      type: 'directory',
      path: '/another-folder',
      setSize: 5,
      posInSet: 2,
    },
    {
      name: 'index.css',
      depth: 1,
      type: 'file',
      path: '/index.css',
      setSize: 5,
      posInSet: 3,
    },
    {
      name: 'index.html',
      depth: 1,
      type: 'file',
      path: '/index.html',
      setSize: 5,
      posInSet: 4,
    },
    {
      name: 'nested',
      depth: 1,
      type: 'directory',
      path: '/nested',
      setSize: 5,
      posInSet: 5,
    },
  ])
  expect(getSimpleList(state)).toEqual([
    '.gitkeep',
    'another-folder',
    'index.css',
    'index.html',
    'nested',
  ])
})

// TODO test add items, remove items and both
// TODO test that focus is preserved
test('updateDirents', () => {
  const state = ViewletExplorer.create()
  ViewletExplorer.updateDirents(state, [
    {
      name: '.gitkeep',
      depth: 1,
      type: 'file',
      path: '/.gitkeep',
      setSize: 5,
      posInSet: 1,
    },
    {
      name: 'another-folder',
      depth: 1,
      type: 'directory',
      path: '/another-folder',
      setSize: 5,
      posInSet: 2,
    },
    {
      name: 'index.css',
      depth: 1,
      type: 'file',
      path: '/index.css',
      setSize: 5,
      posInSet: 3,
    },
    {
      name: 'index.html',
      depth: 1,
      type: 'file',
      path: '/index.html',
      setSize: 5,
      posInSet: 4,
    },
    {
      name: 'nested',
      depth: 1,
      type: 'directory',
      path: '/nested',
      setSize: 5,
      posInSet: 5,
    },
  ])
  ViewletExplorer.updateDirents(state, [
    {
      name: '.gitkeep',
      depth: 1,
      type: 'file',
      path: '/.gitkeep',
      setSize: 5,
      posInSet: 1,
    },
    {
      name: 'another-folder',
      depth: 1,
      type: 'directory',
      path: '/another-folder',
      setSize: 5,
      posInSet: 2,
    },
    {
      name: 'index.css',
      depth: 1,
      type: 'file',
      path: '/index.css',
      setSize: 5,
      posInSet: 3,
    },
    {
      name: 'index.html',
      depth: 1,
      type: 'file',
      path: '/index.html',
      setSize: 5,
      posInSet: 4,
    },
    {
      name: 'nested',
      depth: 1,
      type: 'directory',
      path: '/nested',
      setSize: 5,
      posInSet: 5,
    },
    {
      name: 'fileA.ts',
      depth: 2,
      type: 'file',
      path: '/nested/fileA.ts',
      setSize: 4,
      posInSet: 1,
    },
    {
      name: 'fileB.ts',
      depth: 2,
      type: 'file',
      path: '/nested/fileB.ts',
      setSize: 4,
      posInSet: 2,
    },
    {
      name: 'fileC.ts',
      depth: 2,
      type: 'file',
      path: '/nested/fileC.ts',
      setSize: 4,
      posInSet: 3,
    },
    {
      name: 'very',
      depth: 2,
      type: 'directory',
      path: '/nested/very',
      setSize: 4,
      posInSet: 4,
    },
  ])
  expect(getSimpleList(state)).toEqual([
    '.gitkeep',
    'another-folder',
    'index.css',
    'index.html',
    'nested',
    'fileA.ts',
    'fileB.ts',
    'fileC.ts',
    'very',
  ])
})

// TODO there is a bug with icons
test.skip('updateDirents - bug with icons', () => {
  const state = ViewletExplorer.create()
  ViewletExplorer.updateDirents(state, [
    {
      name: '.gitkeep',
      depth: 1,
      type: 'file',
      path: '/.gitkeep',
      setSize: 5,
      posInSet: 1,
    },
    {
      name: 'another-folder',
      depth: 1,
      type: 'directory',
      path: '/another-folder',
      setSize: 5,
      posInSet: 2,
    },
    {
      name: 'index.css',
      depth: 1,
      type: 'file',
      path: '/index.css',
      setSize: 5,
      posInSet: 3,
    },
    {
      name: 'index.html',
      depth: 1,
      type: 'file',
      path: '/index.html',
      setSize: 5,
      posInSet: 4,
    },
    {
      name: 'nested',
      depth: 1,
      type: 'directory',
      path: '/nested',
      setSize: 5,
      posInSet: 5,
    },
  ])
  ViewletExplorer.updateDirents(state, [
    {
      name: '.gitkeep',
      depth: 1,
      type: 'file',
      path: '/.gitkeep',
      setSize: 5,
      posInSet: 1,
    },
    {
      name: 'another-folder',
      depth: 1,
      type: 'directory',
      path: '/another-folder',
      setSize: 5,
      posInSet: 2,
    },
    {
      name: 'index.css',
      depth: 1,
      type: 'file',
      path: '/index.css',
      setSize: 5,
      posInSet: 3,
    },
    {
      name: 'index.html',
      depth: 1,
      type: 'file',
      path: '/index.html',
      setSize: 5,
      posInSet: 4,
    },
    {
      name: 'nested',
      depth: 1,
      type: 'directory',
      path: '/nested',
      setSize: 5,
      posInSet: 5,
    },
    {
      name: 'fileA.ts',
      depth: 2,
      type: 'file',
      path: '/nested/fileA.ts',
      setSize: 4,
      posInSet: 1,
    },
    {
      name: 'fileB.ts',
      depth: 2,
      type: 'file',
      path: '/nested/fileB.ts',
      setSize: 4,
      posInSet: 2,
    },
    {
      name: 'fileC.ts',
      depth: 2,
      type: 'file',
      path: '/nested/fileC.ts',
      setSize: 4,
      posInSet: 3,
    },
    {
      name: 'very',
      depth: 2,
      type: 'directory',
      path: '/nested/very',
      setSize: 4,
      posInSet: 4,
    },
  ])
  expect(getSimpleList(state)).toEqual([
    '.gitkeep',
    'another-folder',
    'index.css',
    'index.html',
    'nested',
    'fileA.ts',
    'fileB.ts',
    'fileC.ts',
    'very',
  ])
})

test('updateDirents - bug with folder attributes on files', () => {
  const state = ViewletExplorer.create()
  ViewletExplorer.updateDirents(state, [
    {
      name: 'file-1',
      depth: 1,
      type: 'file',
      path: '/file-1',
      setSize: 1,
      posInSet: 1,
    },
  ])
  expect(state.$Viewlet.children[0].textContent).toBe('file-1')
  expect(state.$Viewlet.children[0].ariaExpanded).not.toBeDefined()
  ViewletExplorer.updateDirents(state, [
    {
      name: 'folder-1',
      depth: 1,
      type: 'directory',
      path: '/folder-1',
      setSize: 1,
      posInSet: 1,
    },
  ])
  expect(state.$Viewlet.children[0].textContent).toBe('folder-1')
  expect(state.$Viewlet.children[0].ariaExpanded).toBe('false')
  ViewletExplorer.updateDirents(state, [
    {
      name: 'file-1',
      depth: 1,
      type: 'file',
      path: '/file-1',
      setSize: 1,
      posInSet: 1,
    },
  ])
  expect(state.$Viewlet.children[0].textContent).toBe('file-1')
  expect(state.$Viewlet.children[0].ariaExpanded).not.toBeDefined()
})

test('focusIndex', () => {
  const state = ViewletExplorer.create()
  ViewletExplorer.updateDirents(state, [
    {
      name: 'index.css',
      depth: 1,
      type: 'file',
      path: '/index.css',
      setSize: 2,
      posInSet: 1,
    },
    {
      name: 'index.html',
      depth: 1,
      type: 'file',
      path: '/index.html',
      setSize: 2,
      posInSet: 2,
    },
  ])
  document.body.append(state.$Viewlet)
  ViewletExplorer.setFocusedIndex(state, -1, 0)
  expect(document.activeElement).toBe(state.$Viewlet.children[0])
  ViewletExplorer.setFocusedIndex(state, -1, 1)
  expect(document.activeElement).toBe(state.$Viewlet.children[1])
})

test('event - contextmenu', () => {
  const state = ViewletExplorer.create()
  ViewletExplorer.updateDirents(state, [
    {
      name: '.gitkeep',
      depth: 1,
      type: 'file',
      path: '/.gitkeep',
      setSize: 5,
      posInSet: 1,
    },
    {
      name: 'another-folder',
      depth: 1,
      type: 'directory',
      path: '/another-folder',
      setSize: 5,
      posInSet: 2,
    },
    {
      name: 'index.css',
      depth: 1,
      type: 'file',
      path: '/index.css',
      setSize: 5,
      posInSet: 3,
    },
    {
      name: 'index.html',
      depth: 1,
      type: 'file',
      path: '/index.html',
      setSize: 5,
      posInSet: 4,
    },
    {
      name: 'nested',
      depth: 1,
      type: 'directory',
      path: '/nested',
      setSize: 5,
      posInSet: 5,
    },
  ])
  // @ts-ignore
  const $GitKeep = state.$Viewlet.children[0]
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  $GitKeep.dispatchEvent(
    new MouseEvent('contextmenu', {
      clientX: 50,
      clientY: 50,
      bubbles: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith([
    'Explorer.handleContextMenu',
    50,
    50,
    0,
  ])
})

// TODO test expand/collapse

// TODO test focus

test('event - click', () => {
  const state = ViewletExplorer.create()
  ViewletExplorer.updateDirents(state, [
    {
      name: '.gitkeep',
      depth: 1,
      type: 'file',
      path: '/.gitkeep',
      setSize: 5,
      posInSet: 1,
    },
    {
      name: 'another-folder',
      depth: 1,
      type: 'directory',
      path: '/another-folder',
      setSize: 5,
      posInSet: 2,
    },
    {
      name: 'index.css',
      depth: 1,
      type: 'file',
      path: '/index.css',
      setSize: 5,
      posInSet: 3,
    },
    {
      name: 'index.html',
      depth: 1,
      type: 'file',
      path: '/index.html',
      setSize: 5,
      posInSet: 4,
    },
    {
      name: 'nested',
      depth: 1,
      type: 'directory',
      path: '/nested',
      setSize: 5,
      posInSet: 5,
    },
  ])
  const $GitKeep = state.$Viewlet.children[0]
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  $GitKeep.dispatchEvent(
    new MouseEvent('mousedown', {
      clientX: 50,
      clientY: 50,
      bubbles: true,
      button: 0,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith([
    'ViewletExplorer.handleClick',
    0,
  ])
})

test('event - click on wrapper div', () => {
  const state = ViewletExplorer.create()
  ViewletExplorer.updateDirents(state, [
    {
      name: 'index.css',
      depth: 1,
      type: 'file',
      path: '/index.css',
    },
    {
      name: 'index.html',
      depth: 1,
      type: 'file',
      path: '/index.html',
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  state.$Viewlet.dispatchEvent(
    new MouseEvent('mousedown', {
      clientX: 50,
      clientY: 50,
      bubbles: true,
      button: 0,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith([
    'ViewletExplorer.handleClick',
    -1,
  ])
})

test('event - right click', () => {
  const state = ViewletExplorer.create()
  ViewletExplorer.updateDirents(state, [
    {
      name: '.gitkeep',
      depth: 1,
      type: 'file',
      path: '/.gitkeep',
    },
    {
      name: 'another-folder',
      depth: 1,
      type: 'directory',
      path: '/another-folder',
    },
    {
      name: 'index.css',
      depth: 1,
      type: 'file',
      path: '/index.css',
    },
    {
      name: 'index.html',
      depth: 1,
      type: 'file',
      path: '/index.html',
    },
    {
      name: 'nested',
      depth: 1,
      type: 'directory',
      path: '/nested',
    },
  ])
  const $GitKeep = state.$Viewlet.children[0]
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  $GitKeep.dispatchEvent(
    new MouseEvent('mousedown', {
      clientX: 50,
      clientY: 50,
      bubbles: true,
      button: 1,
    })
  )
  expect(RendererWorker.send).not.toHaveBeenCalled()
})

test('accessibility - viewlet should have role tree', () => {
  const state = ViewletExplorer.create()
  expect(state.$Viewlet.getAttribute('role')).toBe('tree')
})

test('accessibility - dirents should have ariaSetSize, ariaPosInSet, ariaLevel and ariaDescription', () => {
  const state = ViewletExplorer.create()
  ViewletExplorer.updateDirents(state, [
    {
      name: 'file-1',
      depth: 1,
      type: 'file',
      path: '/file-1',
      setSize: 2,
      posInSet: 1,
    },
    {
      name: 'folder-2',
      depth: 1,
      type: 'directory',
      path: '/folder-2',
      setSize: 2,
      posInSet: 2,
    },
  ])
  const $DirentOne = state.$Viewlet.children[0]
  expect($DirentOne.ariaExpanded).not.toBeDefined()
  expect($DirentOne.ariaPosInSet).toBe('1')
  expect($DirentOne.ariaSetSize).toBe('2')
  expect($DirentOne.ariaLevel).toBe('1')
  // @ts-ignore
  expect($DirentOne.ariaDescription).toBe('')

  const $DirentTwo = state.$Viewlet.children[1]
  expect($DirentTwo.ariaExpanded).toBe('false')
  expect($DirentTwo.ariaPosInSet).toBe('2')
  expect($DirentTwo.ariaSetSize).toBe('2')
  expect($DirentTwo.ariaLevel).toBe('1')
  // @ts-ignore
  expect($DirentOne.ariaDescription).toBe('')
})

// TODO test aria-expanded accessibility

test('showRenameInputBox', () => {
  const state = ViewletExplorer.create()
  ViewletExplorer.updateDirents(state, [
    {
      name: 'file-1',
      depth: 1,
      type: 'file',
      path: '/file-1',
      setSize: 2,
      posInSet: 1,
    },
    {
      name: 'folder-2',
      depth: 1,
      type: 'directory',
      path: '/folder-2',
      setSize: 2,
      posInSet: 2,
    },
  ])
  ViewletExplorer.showRenameInputBox(state, 0, 'file-1')
  expect(state.$Viewlet.children).toHaveLength(2)
  const $InputBox = state.$Viewlet.children[0]
  // @ts-ignore
  const start = $InputBox.selectionStart
  // @ts-ignore
  const end = $InputBox.selectionEnd
  expect(start).toBe(0)
  expect(end).toBe(6)
})

test('hideRenameInputBox', () => {
  const state = ViewletExplorer.create()
  ViewletExplorer.updateDirents(state, [
    {
      name: 'file-1',
      depth: 1,
      type: 'file',
      path: '/file-1',
      setSize: 2,
      posInSet: 1,
    },
    {
      name: 'folder-2',
      depth: 1,
      type: 'directory',
      path: '/folder-2',
      setSize: 2,
      posInSet: 2,
    },
  ])
  ViewletExplorer.showRenameInputBox(state, 0, 'file-1')
  ViewletExplorer.hideRenameBox(state, 0, {
    name: 'file-1',
    depth: 1,
    type: 'file',
    path: '/file-1',
    setSize: 2,
    posInSet: 1,
  })
  expect(state.$Viewlet.children).toHaveLength(2)
  const $File1 = state.$Viewlet.children[0]
  expect($File1.textContent).toBe('file-1')
})
