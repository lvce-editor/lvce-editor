import { beforeEach, expect, jest, test } from '@jest/globals'
import * as SideBarLocationType from '../src/parts/SideBarLocationType/SideBarLocationType.js'

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({
  execute: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/ViewletStates/ViewletStates.js', () => ({
  getState: jest.fn(),
}))

const Command = await import('../src/parts/Command/Command.js')
const ResetLayout = await import('../src/parts/ResetLayout/ResetLayout.ts')
const ViewletStates = await import('../src/parts/ViewletStates/ViewletStates.js')

beforeEach(() => {
  jest.resetAllMocks()
  jest.spyOn(Command, 'execute').mockImplementation((command) => {
    if (command === 'Workspace.getPath') {
      return '/test'
    }
    return undefined
  })
  jest.spyOn(ViewletStates, 'getState').mockReturnValue({
    activityBarHeight: 718,
    activityBarLeft: 976,
    activityBarTop: 30,
    activityBarWidth: 48,
  })
})

test('reset restores the initial application state', async () => {
  /** @type {any} */
  const state = {
    panelVisible: true,
    panelMaximized: true,
    sideBarLocation: SideBarLocationType.Left,
    sideBarFocusMode: true,
    sideBarView: 'Search',
    sideBarVisible: false,
  }

  await expect(ResetLayout.reset(state)).resolves.toEqual({
    commands: [],
    newState: state,
  })

  expect(Command.execute).toHaveBeenCalledTimes(14)
  expect(Command.execute).toHaveBeenNthCalledWith(1, 'Menu.hide', false)
  expect(Command.execute).toHaveBeenNthCalledWith(2, 'Viewlet.closeWidget', 'QuickPick')
  expect(Command.execute).toHaveBeenNthCalledWith(3, 'Viewlet.closeWidget', 'Dialog')
  expect(Command.execute).toHaveBeenNthCalledWith(4, 'Viewlet.closeWidget', 'Confirm')
  expect(Command.execute).toHaveBeenNthCalledWith(5, 'ColorTheme.setColorTheme', 'slime')
  expect(Command.execute).toHaveBeenNthCalledWith(6, 'Main.closeAllEditors')
  expect(Command.execute).toHaveBeenNthCalledWith(7, 'Workspace.getPath')
  expect(Command.execute).toHaveBeenNthCalledWith(8, 'Workspace.close')
  expect(Command.execute).toHaveBeenNthCalledWith(9, 'Layout.leaveSideBarFocusMode')
  expect(Command.execute).toHaveBeenNthCalledWith(10, 'Layout.moveSideBarRight')
  expect(Command.execute).toHaveBeenNthCalledWith(11, 'Layout.showSideBar', 'Explorer')
  expect(Command.execute).toHaveBeenNthCalledWith(12, 'Layout.unmaximizePanel')
  expect(Command.execute).toHaveBeenNthCalledWith(13, 'Layout.hidePanel')
  expect(Command.execute).toHaveBeenNthCalledWith(14, 'ActivityBar.reset', {
    height: 718,
    width: 48,
    x: 976,
    y: 30,
  })
})

test('reset leaves an initial layout in place', async () => {
  /** @type {any} */
  const state = {
    panelMaximized: false,
    panelVisible: false,
    sideBarLocation: SideBarLocationType.Right,
    sideBarFocusMode: false,
    sideBarView: 'Explorer',
    sideBarVisible: true,
  }

  jest.spyOn(Command, 'execute').mockResolvedValue(undefined)

  await ResetLayout.reset(state)

  expect(Command.execute).not.toHaveBeenCalledWith('Workspace.close')
  expect(Command.execute).not.toHaveBeenCalledWith('Layout.leaveSideBarFocusMode')
  expect(Command.execute).not.toHaveBeenCalledWith('Layout.moveSideBarRight')
  expect(Command.execute).not.toHaveBeenCalledWith('Layout.showSideBar', 'Explorer')
  expect(Command.execute).not.toHaveBeenCalledWith('Layout.unmaximizePanel')
  expect(Command.execute).not.toHaveBeenCalledWith('Layout.hidePanel')
  expect(Command.execute).toHaveBeenLastCalledWith('ActivityBar.reset', expect.any(Object))
})
