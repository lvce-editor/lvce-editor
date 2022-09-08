import * as DirentType from '../src/parts/DirentType/DirentType.js'
import * as ViewletExplorerFocusIndex from '../src/parts/ViewletExplorer/ViewletExplorerFocusIndex.js'

test('focusIndex - scroll up', () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 1,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 1,
    maxLineY: 2,
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
  expect(ViewletExplorerFocusIndex.focusIndex(state, 0)).toMatchObject({
    focusedIndex: 0,
    minLineY: 0,
    maxLineY: 1,
  })
})

test('focusIndex - scroll down', () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 1,
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
  expect(ViewletExplorerFocusIndex.focusIndex(state, 1)).toMatchObject({
    focusedIndex: 1,
    minLineY: 1,
    maxLineY: 2,
  })
})

test('focusIndex - focus container', () => {
  const state = {
    root: '/home/test-user/test-path',
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 0,
    maxLineY: 1,
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
  expect(ViewletExplorerFocusIndex.focusIndex(state, -1)).toMatchObject({
    focusedIndex: -1,
    minLineY: 0,
    maxLineY: 1,
  })
})
