/**
 * @jest-environment jsdom
 */
import * as DirentType from '../src/parts/DirentType/DirentType.js'

/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'

jest.unstable_mockModule(
  '../src/parts/RendererWorker/RendererWorker.js',
  () => {
    return {
      send: jest.fn(),
    }
  }
)

const ViewletExplorer = await import(
  '../src/parts/ViewletExplorer/ViewletExplorer.js'
)

beforeEach(() => {
  document.body.textContent = ''
})

const getTextContent = ($Node) => {
  return $Node.textContent
}
const getSimpleList = (state) => {
  return Array.from(state.$Viewlet.children).map(getTextContent)
}

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
  const { $Viewlet } = state
  ViewletExplorer.handleError(state, 'Error: Oops')
  expect($Viewlet.textContent).toBe('Error: Oops')
})

test('updateDirents', () => {
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
    {
      name: 'fileA.ts',
      depth: 2,
      type: DirentType.File,
      path: '/nested/fileA.ts',
      setSize: 4,
      posInSet: 1,
    },
    {
      name: 'fileB.ts',
      depth: 2,
      type: DirentType.File,
      path: '/nested/fileB.ts',
      setSize: 4,
      posInSet: 2,
    },
    {
      name: 'fileC.ts',
      depth: 2,
      type: DirentType.File,
      path: '/nested/fileC.ts',
      setSize: 4,
      posInSet: 3,
    },
    {
      name: 'very',
      depth: 2,
      type: DirentType.Directory,
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
    {
      name: 'fileA.ts',
      depth: 2,
      type: DirentType.File,
      path: '/nested/fileA.ts',
      setSize: 4,
      posInSet: 1,
    },
    {
      name: 'fileB.ts',
      depth: 2,
      type: DirentType.File,
      path: '/nested/fileB.ts',
      setSize: 4,
      posInSet: 2,
    },
    {
      name: 'fileC.ts',
      depth: 2,
      type: DirentType.File,
      path: '/nested/fileC.ts',
      setSize: 4,
      posInSet: 3,
    },
    {
      name: 'very',
      depth: 2,
      type: DirentType.Directory,
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
  const { $Viewlet } = state
  ViewletExplorer.updateDirents(state, [
    {
      name: 'file-1',
      depth: 1,
      type: DirentType.File,
      path: '/file-1',
      setSize: 1,
      posInSet: 1,
    },
  ])
  expect($Viewlet.children[0].textContent).toBe('file-1')
  expect($Viewlet.children[0].ariaExpanded).not.toBeDefined()
  ViewletExplorer.updateDirents(state, [
    {
      name: 'folder-1',
      depth: 1,
      type: DirentType.Directory,
      path: '/folder-1',
      setSize: 1,
      posInSet: 1,
    },
  ])
  expect($Viewlet.children[0].textContent).toBe('folder-1')
  expect($Viewlet.children[0].ariaExpanded).toBe('false')
  ViewletExplorer.updateDirents(state, [
    {
      name: 'file-1',
      depth: 1,
      type: DirentType.File,
      path: '/file-1',
      setSize: 1,
      posInSet: 1,
    },
  ])
  expect($Viewlet.children[0].textContent).toBe('file-1')
  expect($Viewlet.children[0].ariaExpanded).not.toBeDefined()
})

test('setFocusedIndex', () => {
  const state = ViewletExplorer.create()
  const { $Viewlet } = state
  ViewletExplorer.updateDirents(state, [
    {
      name: 'index.css',
      depth: 1,
      type: DirentType.File,
      path: '/index.css',
      setSize: 2,
      posInSet: 1,
    },
    {
      name: 'index.html',
      depth: 1,
      type: DirentType.File,
      path: '/index.html',
      setSize: 2,
      posInSet: 2,
    },
  ])
  document.body.append($Viewlet)
  ViewletExplorer.setFocusedIndex(state, -1, 0, true)
  expect(document.activeElement).toBe($Viewlet)
  ViewletExplorer.setFocusedIndex(state, -1, 1, true)
  expect(document.activeElement).toBe($Viewlet)
})

test('setFocusedIndex - no focus', () => {
  const state = ViewletExplorer.create()
  const { $Viewlet } = state
  ViewletExplorer.updateDirents(state, [
    {
      name: 'index.css',
      depth: 1,
      type: DirentType.File,
      path: '/index.css',
      setSize: 2,
      posInSet: 1,
    },
    {
      name: 'index.html',
      depth: 1,
      type: DirentType.File,
      path: '/index.html',
      setSize: 2,
      posInSet: 2,
    },
  ])
  document.body.append($Viewlet)
  ViewletExplorer.setFocusedIndex(state, -1, 0, false)
  expect(document.activeElement).toBe(document.body)
  ViewletExplorer.setFocusedIndex(state, -1, 1, false)
  expect(document.activeElement).toBe(document.body)
})

// TODO test expand/collapse

// TODO test focus

test('accessibility - viewlet should have role tree', () => {
  const state = ViewletExplorer.create()
  // @ts-ignore
  expect(state.$Viewlet.role).toBe('tree')
})

test('accessibility - dirents should have ariaSetSize, ariaPosInSet, ariaLevel and ariaDescription', () => {
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
  const $DirentOne = $Viewlet.children[0]
  expect($DirentOne.ariaExpanded).not.toBeDefined()
  expect($DirentOne.ariaPosInSet).toBe('1')
  expect($DirentOne.ariaSetSize).toBe('2')
  expect($DirentOne.ariaLevel).toBe('1')
  expect($DirentOne.getAttribute('tabIndex')).toBeNull()
  // @ts-ignore
  expect($DirentOne.ariaDescription).toBe('')

  const $DirentTwo = $Viewlet.children[1]
  expect($DirentTwo.ariaExpanded).toBe('false')
  expect($DirentTwo.ariaPosInSet).toBe('2')
  expect($DirentTwo.ariaSetSize).toBe('2')
  expect($DirentTwo.ariaLevel).toBe('1')
  expect($DirentTwo.getAttribute('tabIndex')).toBeNull()
  // @ts-ignore
  expect($DirentOne.ariaDescription).toBe('')
})

// TODO test aria-expanded accessibility

test('replaceWithEditBox', () => {
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
  ViewletExplorer.replaceWithEditBox(state, 0, 'file-1')
  expect($Viewlet.children).toHaveLength(2)
  const $InputBox = $Viewlet.children[0].children[1]
  // @ts-ignore
  const start = $InputBox.selectionStart
  // @ts-ignore
  const end = $InputBox.selectionEnd
  expect(start).toBe(0)
  expect(end).toBe(6)
})

test('hideEditBox', () => {
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
  ViewletExplorer.insertEditBox(state, 0, 'file-1')
  ViewletExplorer.hideEditBox(state, 0)
  expect($Viewlet.children).toHaveLength(2)
  const $File1 = state.$Viewlet.children[0]
  expect($File1.textContent).toBe('file-1')
})

test('setDropTargets - mark outer as drop target', () => {
  const state = ViewletExplorer.create()
  ViewletExplorer.setDropTargets(state, [], [-1])
  expect(state.$Viewlet.classList.contains('DropTarget')).toBe(true)
})

test('setDropTargets - remove outer as drop target', () => {
  const state = ViewletExplorer.create()
  const { $Viewlet } = state
  ViewletExplorer.setDropTargets(state, [], [-1])
  ViewletExplorer.setDropTargets(state, [-1], [])
  expect($Viewlet.classList.contains('DropTarget')).toBe(false)
})
