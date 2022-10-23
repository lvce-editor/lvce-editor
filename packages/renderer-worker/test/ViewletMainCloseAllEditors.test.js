import * as ViewletMainCloseAllEditors from '../src/parts/ViewletMain/ViewletMainCloseAllEditors.js'

test('closeAllEditors', () => {
  const state = {
    editors: [{ uri: '/test/file-1.txt' }],
    focusedIndex: 0,
    selectedIndex: 0,
  }
  const newState = ViewletMainCloseAllEditors.closeAllEditors(state)
  expect(newState.editors).toEqual([])
  expect(newState.focusedIndex).toBe(0)
  expect(newState.selectedIndex).toBe(0)
})
