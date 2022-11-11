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
  await ViewletSimpleBrowserHandleContextMenu.handleContextMenu(state, {
    x: 20,
    y: 20,
  })
  expect(ElectronMenu.openContextMenu).toHaveBeenCalledTimes(1)
  expect(ElectronMenu.openContextMenu).toHaveBeenCalledWith(
    30,
    60,
    MenuEntryId.SimpleBrowser,
    30,
    60,
    { x: 20, y: 20 }
  )
})
