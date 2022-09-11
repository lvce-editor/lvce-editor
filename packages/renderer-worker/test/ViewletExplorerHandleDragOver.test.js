import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

const ViewletExplorerHandleDragOver = await import(
  '../src/parts/ViewletExplorer/ViewletExplorerHandleDragOver.js'
)
const ViewletExplorer = await import(
  '../src/parts/ViewletExplorer/ViewletExplorer.js'
)

test.skip('handleDragOver - outer', () => {
  const state = {
    ...ViewletExplorer.create(),
    root: '/test',
    focusedIndex: -1,
    dirents: [],
    pathSeparator: '/',
    top: 0,
    left: 0,
    minLineY: 0,
    maxLineY: 0,
  }
  const newState = ViewletExplorerHandleDragOver.handleDragOver(state, 0, 0)
  expect(newState.dropTargets).toEqual([-1])
})

test('handleDragOver - first index', () => {
  const state = {
    ...ViewletExplorer.create(),
    root: '/test',
    focusedIndex: 1,
    dirents: [],
    pathSeparator: '/',
    top: 0,
    left: 0,
    minLineY: 0,
    maxLineY: 0,
  }
  console.log(ViewletExplorerHandleDragOver.handleDragOver(state, 0, 0))
  const newState = ViewletExplorerHandleDragOver.handleDragOver(state, 0, 0)
  expect(newState.dropTargets).toEqual([0])
})
