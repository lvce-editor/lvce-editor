import { beforeEach, expect, jest, test } from '@jest/globals'
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
const ViewletSearchHandleContextMenuMouseAt = await import('../src/parts/ViewletSearch/ViewletSearchHandleContextMenuMouseAt.ts')
const ContextMenu = await import('../src/parts/ContextMenu/ContextMenu.js')

test('handleContextMenuMouseAt', async () => {
  // @ts-ignore
  ContextMenu.show.mockImplementation(() => {})
  // @ts-ignore
  const state = { ...ViewletSearch.create(), x: 0, y: 0 }
  expect(await ViewletSearchHandleContextMenuMouseAt.handleContextMenuMouseAt(state, 10, 10)).toBe(state)
  expect(ContextMenu.show).toHaveBeenCalledTimes(1)
  expect(ContextMenu.show).toHaveBeenCalledWith(10, 10, MenuEntryId.Search)
})
