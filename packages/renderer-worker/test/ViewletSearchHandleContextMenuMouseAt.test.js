import { jest } from '@jest/globals'
import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.js'

beforeEach(() => {
  jest.resetAllMocks()
  jest.resetModules()
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: jest.fn(() => {
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
const ViewletSearchHandleContextMenuMouseAt = await import('../src/parts/ViewletSearch/ViewletSearchHandleContextMenuMouseAt.js')
const Command = await import('../src/parts/Command/Command.js')

test('handleContextMenuMouseAt', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  const state = { ...ViewletSearch.create(), x: 0, y: 0 }
  expect(await ViewletSearchHandleContextMenuMouseAt.handleContextMenuMouseAt(state, 10, 10)).toBe(state)
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith('ContextMenu.show', 10, 10, MenuEntryId.Search)
})
