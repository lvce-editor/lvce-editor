import { jest } from '@jest/globals'
import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

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
const ViewletSearchHandleContextMenuKeyBoard = await import('../src/parts/ViewletSearch/ViewletSearchHandleContextMenuKeyBoard.js')
const Command = await import('../src/parts/Command/Command.js')

test('handleContextMenuKeyBoard', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  const state = { ...ViewletSearch.create(), x: 0, y: 0 }
  expect(await ViewletSearchHandleContextMenuKeyBoard.handleContextMenuKeyboard(state)).toBe(state)
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith('ContextMenu.show', 0, 0, MenuEntryId.Search)
})
