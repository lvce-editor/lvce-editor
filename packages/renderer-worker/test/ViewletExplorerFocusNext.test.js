import * as DirentType from '../src/parts/DirentType/DirentType.js'
import * as ViewletExplorerFocusNext from '../src/parts/ViewletExplorer/ViewletExplorerFocusNext.js'

test('focusNext', () => {
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
  expect(ViewletExplorerFocusNext.focusNext(state)).toMatchObject({
    focusedIndex: 1,
  })
})

test('focusNext - when no focus', () => {
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
  expect(ViewletExplorerFocusNext.focusNext(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusNext - at end', () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 2,
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
  expect(ViewletExplorerFocusNext.focusNext(state)).toMatchObject({
    focusedIndex: 2,
  })
})
