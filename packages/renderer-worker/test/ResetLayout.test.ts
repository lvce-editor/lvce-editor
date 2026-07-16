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
  const state = {
    panelVisible: true,
    panelMaximized: true,
    panelView: 'Output',
    sideBarLocation: SideBarLocationType.Left,
    sideBarFocusMode: true,
    sideBarView: 'Search',
    sideBarVisible: false,
    titleBarWidth: 1024,
  } as any

  await expect(ResetLayout.reset(state)).resolves.toEqual({
    commands: [],
    newState: state,
  })

  expect(Command.execute).toHaveBeenCalledTimes(19)
  expect(Command.execute).toHaveBeenNthCalledWith(1, 'Menu.hide', false)
  expect(Command.execute).toHaveBeenNthCalledWith(2, 'TitleBar.closeMenu')
  expect(Command.execute).toHaveBeenNthCalledWith(3, 'TitleBar.setTitleTemplate', '${folderName}')
  expect(Command.execute).toHaveBeenNthCalledWith(4, 'TitleBar.setWidth', 1024)
  expect(Command.execute).toHaveBeenNthCalledWith(5, 'Viewlet.closeWidget', 'QuickPick')
  expect(Command.execute).toHaveBeenNthCalledWith(6, 'Viewlet.closeWidget', 'Dialog')
  expect(Command.execute).toHaveBeenNthCalledWith(7, 'Viewlet.closeWidget', 'Confirm')
  expect(Command.execute).toHaveBeenNthCalledWith(8, 'ColorTheme.setColorTheme', 'slime')
  expect(Command.execute).toHaveBeenNthCalledWith(9, 'Main.closeAllEditors')
  expect(Command.execute).toHaveBeenNthCalledWith(10, 'Workspace.getPath')
  expect(Command.execute).toHaveBeenNthCalledWith(11, 'Workspace.close')
  expect(Command.execute).toHaveBeenNthCalledWith(12, 'Layout.leaveSideBarFocusMode')
  expect(Command.execute).toHaveBeenNthCalledWith(13, 'Layout.moveSideBarRight')
  expect(Command.execute).toHaveBeenNthCalledWith(14, 'Layout.showSideBar', 'Explorer')
  expect(Command.execute).toHaveBeenNthCalledWith(15, 'Layout.unmaximizePanel')
  expect(Command.execute).toHaveBeenNthCalledWith(16, 'Layout.showPanel', 'Problems')
  expect(Command.execute).toHaveBeenNthCalledWith(17, 'Layout.hidePanel')
  expect(Command.execute).toHaveBeenNthCalledWith(18, 'ActivityBar.create', '', 976, 30, 48, 718, null, null, -1)
  expect(Command.execute).toHaveBeenNthCalledWith(19, 'ActivityBar.loadContent', {})
})

test('reset leaves an initial layout in place', async () => {
  const state = {
    panelMaximized: false,
    panelView: 'Problems',
    panelVisible: false,
    sideBarLocation: SideBarLocationType.Right,
    sideBarFocusMode: false,
    sideBarView: 'Explorer',
    sideBarVisible: true,
    titleBarWidth: 1024,
  } as any

  jest.spyOn(Command, 'execute').mockResolvedValue(undefined)

  await ResetLayout.reset(state)

  expect(Command.execute).not.toHaveBeenCalledWith('Workspace.close')
  expect(Command.execute).not.toHaveBeenCalledWith('Layout.leaveSideBarFocusMode')
  expect(Command.execute).not.toHaveBeenCalledWith('Layout.moveSideBarRight')
  expect(Command.execute).not.toHaveBeenCalledWith('Layout.showSideBar', 'Explorer')
  expect(Command.execute).not.toHaveBeenCalledWith('Layout.unmaximizePanel')
  expect(Command.execute).not.toHaveBeenCalledWith('Layout.showPanel', 'Problems')
  expect(Command.execute).not.toHaveBeenCalledWith('Layout.hidePanel')
  expect(Command.execute).toHaveBeenLastCalledWith('ActivityBar.loadContent', {})
})
