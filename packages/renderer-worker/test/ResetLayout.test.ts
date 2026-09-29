import { beforeEach, expect, jest, test } from '@jest/globals'
import * as SideBarLocationType from '../src/parts/SideBarLocationType/SideBarLocationType.js'

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({
  execute: jest.fn(),
}))

const Command = await import('../src/parts/Command/Command.js')
const ResetLayout = await import('../src/parts/ResetLayout/ResetLayout.ts')
const execute = jest.mocked(Command.execute)

beforeEach(() => {
  jest.resetAllMocks()
  jest.spyOn(Command, 'execute').mockImplementation((command) => {
    if (command === 'Workspace.getPath') {
      return '/test'
    }
    return undefined
  })
})

test('reset restores the initial application state', async () => {
  const state = {
    panelMaximized: true,
    panelView: 'Output',
    panelVisible: true,
    sideBarFocusMode: true,
    sideBarLocation: SideBarLocationType.Left,
    sideBarView: 'Search',
    sideBarVisible: false,
    titleBarWidth: 1024,
  } as any

  await expect(ResetLayout.reset(state)).resolves.toEqual({
    commands: [],
    newState: state,
  })

  expect(Command.execute).toHaveBeenCalledTimes(19)
  expect(Command.execute).toHaveBeenCalledWith('Menu.hide', false)
  expect(Command.execute).toHaveBeenCalledWith('TitleBar.closeMenu')
  expect(Command.execute).toHaveBeenCalledWith('TitleBar.setTitleTemplate', '${folderName}')
  expect(Command.execute).toHaveBeenCalledWith('TitleBar.setWidth', 1024)
  expect(Command.execute).toHaveBeenCalledWith('Viewlet.closeWidget', 'QuickPick')
  expect(Command.execute).toHaveBeenCalledWith('Viewlet.closeWidget', 'About')
  expect(Command.execute).toHaveBeenCalledWith('Viewlet.closeWidget', 'Dialog')
  expect(Command.execute).toHaveBeenCalledWith('Viewlet.closeWidget', 'Confirm')
  expect(Command.execute).toHaveBeenCalledWith('ColorTheme.setColorTheme', 'slime')
  expect(Command.execute).toHaveBeenCalledWith('Main.closeAllEditors')
  expect(Command.execute).toHaveBeenCalledWith('Workspace.getPath')
  expect(Command.execute).toHaveBeenCalledWith('Workspace.close')
  expect(Command.execute).toHaveBeenCalledWith('Layout.leaveSideBarFocusMode')
  expect(Command.execute).toHaveBeenCalledWith('Layout.moveSideBarRight')
  expect(Command.execute).toHaveBeenCalledWith('Layout.showSideBar', 'Explorer', false)
  expect(Command.execute).toHaveBeenCalledWith('Layout.unmaximizePanel')
  expect(Command.execute).toHaveBeenCalledWith('Layout.showPanel', 'Problems')
  expect(Command.execute).toHaveBeenCalledWith('Layout.hidePanel')
  expect(Command.execute).toHaveBeenLastCalledWith('ActivityBar.reset')
})

test('reset leaves an initial layout in place', async () => {
  const state = {
    panelMaximized: false,
    panelView: 'Problems',
    panelVisible: false,
    sideBarFocusMode: false,
    sideBarLocation: SideBarLocationType.Right,
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
  expect(Command.execute).toHaveBeenLastCalledWith('ActivityBar.reset')
})

test('resets independent components in parallel', async () => {
  const state = {
    panelMaximized: false,
    panelView: 'Problems',
    panelVisible: false,
    sideBarFocusMode: false,
    sideBarLocation: SideBarLocationType.Right,
    sideBarView: 'Explorer',
    sideBarVisible: true,
    titleBarWidth: 1024,
  } as any
  const resolvers: Array<() => void> = []
  const parallelCommands = new Set(['Menu.hide', 'TitleBar.closeMenu', 'ColorTheme.setColorTheme', 'Main.closeAllEditors'])
  jest.spyOn(Command, 'execute').mockImplementation((command) => {
    if (parallelCommands.has(command)) {
      return new Promise<void>((resolve) => {
        resolvers.push(resolve)
      })
    }
    return undefined
  })

  const resetPromise = ResetLayout.reset(state)
  await Promise.resolve()

  expect(Command.execute).toHaveBeenCalledWith('Menu.hide', false)
  expect(Command.execute).toHaveBeenCalledWith('TitleBar.closeMenu')
  expect(Command.execute).toHaveBeenCalledWith('Viewlet.closeWidget', 'QuickPick')
  expect(Command.execute).toHaveBeenCalledWith('Viewlet.closeWidget', 'About')
  expect(Command.execute).toHaveBeenCalledWith('Viewlet.closeWidget', 'Dialog')
  expect(Command.execute).toHaveBeenCalledWith('Viewlet.closeWidget', 'Confirm')
  expect(Command.execute).toHaveBeenCalledWith('ColorTheme.setColorTheme', 'slime')
  expect(Command.execute).toHaveBeenCalledWith('Main.closeAllEditors')
  expect(Command.execute).not.toHaveBeenCalledWith('ActivityBar.reset')

  for (const resolve of resolvers) {
    resolve()
  }
  await resetPromise
})

test('resetViewLocations restores the initial view arrangement', async () => {
  const state = {
    activityBarVisible: false,
    mainVisible: false,
    panelMaximized: true,
    panelView: 'Output',
    panelVisible: true,
    previewVisible: true,
    secondarySideBarVisible: true,
    sideBarFocusMode: true,
    sideBarLocation: SideBarLocationType.Left,
    sideBarView: 'Search',
    sideBarVisible: false,
    statusBarVisible: false,
    titleBarVisible: false,
  } as any

  await expect(ResetLayout.resetViewLocations(state)).resolves.toEqual({
    commands: [],
    newState: state,
  })

  expect(execute.mock.calls).toEqual([
    ['Layout.leaveSideBarFocusMode'],
    ['Layout.moveSideBarRight'],
    ['Layout.showSideBar', 'Explorer', false],
    ['Layout.unmaximizePanel'],
    ['Layout.showPanel', 'Problems'],
    ['Layout.hidePanel'],
    ['Layout.hideSecondarySideBar'],
    ['Layout.hidePreview'],
    ['Layout.showMain'],
    ['Layout.showActivityBar'],
    ['Layout.showStatusBar'],
    ['Layout.showTitleBar'],
    ['ActivityBar.reset'],
  ])
})

test('resetViewLocations leaves the initial view arrangement in place', async () => {
  const state = {
    activityBarVisible: true,
    mainVisible: true,
    panelMaximized: false,
    panelView: 'Problems',
    panelVisible: false,
    previewVisible: false,
    secondarySideBarVisible: false,
    sideBarFocusMode: false,
    sideBarLocation: SideBarLocationType.Right,
    sideBarView: 'Explorer',
    sideBarVisible: true,
    statusBarVisible: true,
    titleBarVisible: true,
  } as any

  await ResetLayout.resetViewLocations(state)

  expect(execute.mock.calls).toEqual([['ActivityBar.reset']])
})
