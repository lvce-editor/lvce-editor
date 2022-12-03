import { jest } from '@jest/globals'
import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ElectronContextMenu/ElectronContextMenu.js',
  () => {
    return {
      openContextMenu: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const ViewletSimpleBrowser = await import(
  '../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowser.js'
)

const ElectronContextMenu = await import(
  '../src/parts/ElectronContextMenu/ElectronContextMenu.js'
)
const ViewletSimpleBrowserHandleContextMenu = await import(
  '../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserHandleContextMenu.js'
)

test('openContextMenu', async () => {
  // @ts-ignore
  ElectronContextMenu.openContextMenu.mockImplementation(() => {})
  const state = {
    ...ViewletSimpleBrowser.create('', '', 10, 10, 10, 10),
  }
  await ViewletSimpleBrowserHandleContextMenu.handleContextMenu(state, {
    x: 20,
    y: 20,
  })
  expect(ElectronContextMenu.openContextMenu).toHaveBeenCalledTimes(1)
  expect(ElectronContextMenu.openContextMenu).toHaveBeenCalledWith(
    30,
    60,
    MenuEntryId.SimpleBrowser,
    30,
    60,
    { x: 20, y: 20 }
  )
})
