import { jest } from '@jest/globals'
import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ElectronMenu/ElectronMenu.js', () => {
  return {
    openContextMenu: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ViewletSimpleBrowser = await import(
  '../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowser.js'
)

const ElectronMenu = await import('../src/parts/ElectronMenu/ElectronMenu.js')
const ViewletSimpleBrowserHandleContextMenu = await import(
  '../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserHandleContextMenu.js'
)

test('openContextMenu', async () => {
  // @ts-ignore
  ElectronMenu.openContextMenu.mockImplementation(() => {})
  const state = {
    ...ViewletSimpleBrowser.create('', '', 10, 10, 10, 10),
  }
  await ViewletSimpleBrowserHandleContextMenu.handleContextMenu(state, 20, 30)
  expect(ElectronMenu.openContextMenu).toHaveBeenCalledTimes(1)
  expect(ElectronMenu.openContextMenu).toHaveBeenCalledWith(
    30,
    70,
    MenuEntryId.SimpleBrowser
  )
})
