import { jest, beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'
import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.js'

beforeEach(() => {
  jest.resetAllMocks()
  jest.resetModules()
})

jest.unstable_mockModule('../src/parts/ContextMenu/ContextMenu.js', () => {
  return {
    show: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/ErrorHandling/ErrorHandling.js', () => {
  return {
    logError: jest.fn(() => {}),
  }
})

const ViewletSearch = await import('../src/parts/ViewletSearch/ViewletSearch.js')
const ViewletSearchHandleContextMenuKeyBoard = await import('../src/parts/ViewletSearch/ViewletSearchHandleContextMenuKeyBoard.js')
const ContextMenu = await import('../src/parts/ContextMenu/ContextMenu.js')

test('handleContextMenuKeyBoard', async () => {
  // @ts-ignore
  ContextMenu.show.mockImplementation(() => {})
  const state = { ...ViewletSearch.create(), x: 0, y: 0 }
  expect(await ViewletSearchHandleContextMenuKeyBoard.handleContextMenuKeyboard(state)).toBe(state)
  expect(ContextMenu.show).toHaveBeenCalledTimes(1)
  expect(ContextMenu.show).toHaveBeenCalledWith('ContextMenu.show', 0, 0, MenuEntryId.Search)
})
