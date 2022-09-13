import * as DirentType from '../src/parts/DirentType/DirentType.js'
import * as ViewletExplorerFocusPrevious from '../src/parts/ViewletExplorer/ViewletExplorerFocusPrevious.js'

test('focusPrevious', () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 1,
    top: 0,
    height: 600,
    deltaY: 0,
    dirents: [
      {
        name: 'index.css',
        type: DirentType.File,
        path: '/index.css',
      },
      {
        name: 'index.html',
        type: DirentType.File,
        path: '/index.html',
      },
      {
        name: 'test-folder',
        type: DirentType.Directory,
        path: '/test-folder',
      },
    ],
  }
  expect(ViewletExplorerFocusPrevious.focusPrevious(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusPrevious - at start', () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    dirents: [
      {
        name: 'index.css',
        type: DirentType.File,
        path: '/index.css',
      },
      {
        name: 'index.html',
        type: DirentType.File,
        path: '/index.html',
      },
      {
        name: 'test-folder',
        type: DirentType.Directory,
        path: '/test-folder',
      },
    ],
  }
  expect(ViewletExplorerFocusPrevious.focusPrevious(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusPrevious - when no focus', () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    dirents: [
      {
        name: 'index.css',
        type: DirentType.File,
        path: '/index.css',
      },
      {
        name: 'index.html',
        type: DirentType.File,
        path: '/index.html',
      },
      {
        name: 'test-folder',
        type: DirentType.Directory,
        path: '/test-folder',
      },
    ],
  }
  expect(ViewletExplorerFocusPrevious.focusPrevious(state)).toMatchObject({
    focusedIndex: 2,
  })
})

test('focusPrevious - when no focus and no dirents', () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    dirents: [],
  }
  expect(ViewletExplorerFocusPrevious.focusPrevious(state)).toMatchObject({
    focusedIndex: -1,
  })
})
