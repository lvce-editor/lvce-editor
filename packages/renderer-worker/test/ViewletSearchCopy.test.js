import { jest } from '@jest/globals'
import * as TextSearchResultType from '../src/parts/TextSearchResultType/TextSearchResultType.js'

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

const ViewletSearch = await import('../src/parts/ViewletSearch/ViewletSearch.js')
const ViewletSearchCopy = await import('../src/parts/ViewletSearch/ViewletSearchCopy.js')
const Command = await import('../src/parts/Command/Command.js')

test('copy', async () => {
  const state = {
    ...ViewletSearch.create(),
    items: [
      {
        type: TextSearchResultType.File,
        text: 'file.txt',
      },
    ],
    listFocusedIndex: 0,
  }
  await ViewletSearchCopy.copy(state)
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith('ClipBoard.writeText', 'file.txt')
})

test('copy - no item focused', async () => {
  const state = {
    ...ViewletSearch.create(),
    items: [
      {
        type: TextSearchResultType.File,
        text: 'file.txt',
      },
    ],
    listFocusedIndex: -1,
  }
  expect(await ViewletSearchCopy.copy(state)).toBe(state)
  expect(Command.execute).not.toHaveBeenCalled()
})
