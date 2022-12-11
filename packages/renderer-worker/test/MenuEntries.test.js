import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.js'
import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/MenuEntriesModule/MenuEntriesModule.js',
  () => {
    return {
      load: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const MenuEntries = await import('../src/parts/MenuEntries/MenuEntries.js')
const MenuEntriesModule = await import(
  '../src/parts/MenuEntriesModule/MenuEntriesModule.js'
)

// TODO mock external modules for unit test

test.skip('getMenuEntries - activityBar', async () => {
  expect(
    await MenuEntries.getMenuEntries(MenuEntryId.ActivityBar)
  ).toBeInstanceOf(Array)
})

test('getMenuEntries - empty', async () => {
  // @ts-ignore
  MenuEntriesModule.load.mockImplementation(() => {
    return {
      getMenuEntries() {
        return []
      },
    }
  })
  expect(await MenuEntries.getMenuEntries(123)).toEqual([])
})

test('getMenuEntries - error - invalid id', async () => {
  // @ts-ignore
  MenuEntriesModule.load.mockImplementation(() => {
    throw new Error(`module not found -1`)
  })
  await expect(MenuEntries.getMenuEntries(-1)).rejects.toThrowError(
    'Failed to load menu entries for id -1: Error: module not found -1'
  )
})

test('getMenuEntries - error - module fails to load', async () => {
  // @ts-ignore
  MenuEntriesModule.load.mockImplementation(() => {
    throw new TypeError(
      `Failed to fetch dynamically imported module: https://example.com/renderer-worker/src/parts/not-found.js`
    )
  })
  await expect(MenuEntries.getMenuEntries(-1)).rejects.toThrowError(
    new Error(
      `Failed to load menu entries for id -1: TypeError: Failed to fetch dynamically imported module: https://example.com/renderer-worker/src/parts/not-found.js`
    )
  )
})
