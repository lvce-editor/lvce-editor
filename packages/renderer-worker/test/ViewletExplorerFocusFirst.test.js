import * as DirentType from '../src/parts/DirentType/DirentType.js'
import * as ViewletExplorerFocusFirst from '../src/parts/ViewletExplorer/ViewletExplorerFocusFirst.js'

test('focusFirst', () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 1,
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
  expect(ViewletExplorerFocusFirst.focusFirst(state)).toMatchObject({
    focusedIndex: 0,
  })
})

test('focusFirst - no dirents', () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: -1,
    top: 0,
    height: 600,
    deltaY: 0,
    dirents: [],
  }
  expect(ViewletExplorerFocusFirst.focusFirst(state)).toBe(state)
})

test('focusFirst - focus already at first', () => {
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
  expect(ViewletExplorerFocusFirst.focusFirst(state)).toBe(state)
})
