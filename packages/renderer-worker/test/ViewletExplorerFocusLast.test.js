import * as DirentType from '../src/parts/DirentType/DirentType.js'
import * as ViewletExplorer from '../src/parts/ViewletExplorer/ViewletExplorer.js'
import * as ViewletExplorerFocusLast from '../src/parts/ViewletExplorer/ViewletExplorerFocusLast.js'

test('focusLast', () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    dirents: [
      {
        depth: 1,
        index: 0,
        languageId: 'unknown',
        name: 'index.css',
        path: '/index.css',
        setSize: 2,
        type: DirentType.File,
      },
      {
        depth: 1,
        index: 1,
        languageId: 'unknown',
        name: 'index.html',
        path: '/index.html',
        setSize: 2,
        type: DirentType.File,
      },
    ],
  }
  expect(ViewletExplorerFocusLast.focusLast(state)).toMatchObject({
    focusedIndex: 1,
  })
})

test('focusLast - no dirents', () => {
  const state = {
    ...ViewletExplorer.create(),
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    dirents: [],
  }
  expect(ViewletExplorerFocusLast.focusLast(state)).toMatchObject({
    focusedIndex: -1,
  })
})

test('focusLast - focus already at last', () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 1,
    dirents: [
      {
        depth: 1,
        index: 0,
        languageId: 'unknown',
        name: 'index.css',
        path: '/index.css',
        setSize: 2,
        type: DirentType.File,
      },
      {
        depth: 1,
        index: 1,
        languageId: 'unknown',
        name: 'index.html',
        path: '/index.html',
        setSize: 2,
        type: DirentType.File,
      },
    ],
  }
  expect(ViewletExplorerFocusLast.focusLast(state)).toBe(state)
})
