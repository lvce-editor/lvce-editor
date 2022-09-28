import { jest } from '@jest/globals'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'
import * as MenuEntryId from '../src/parts/MenuEntryId/MenuEntryId.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RendererProcess/RendererProcess.js',
  () => {
    return {
      invoke: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)
jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    platform: 'remote',
  }
})
jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ViewletTitleBar = await import(
  '../src/parts/ViewletTitleBar/ViewletTitleBar.js'
)
const Command = await import('../src/parts/Command/Command.js')

test('name', () => {
  expect(ViewletTitleBar.name).toBe('TitleBar')
})

test('create', () => {
  const state = ViewletTitleBar.create()
  expect(state).toBeDefined()
})

test('loadContent', async () => {
  const state = ViewletTitleBar.create()
  expect(await ViewletTitleBar.loadContent(state)).toMatchObject({
    titleBarEntries: [
      {
        flags: MenuItemFlags.None,
        id: MenuEntryId.File,
        name: 'File',
      },
      {
        flags: MenuItemFlags.None,
        id: MenuEntryId.Edit,
        name: 'Edit',
      },
      {
        flags: MenuItemFlags.None,
        id: MenuEntryId.Selection,
        name: 'Selection',
      },
      {
        flags: MenuItemFlags.None,
        id: MenuEntryId.View,
        name: 'View',
      },
      {
        flags: MenuItemFlags.None,
        id: MenuEntryId.Go,
        name: 'Go',
      },
      {
        flags: MenuItemFlags.None,
        id: MenuEntryId.Run,
        keyboardShortCut: 'Alt+r',
        name: 'Run',
      },
      {
        flags: MenuItemFlags.None,
        id: MenuEntryId.Terminal,
        keyboardShortCut: 'Alt+t',
        name: 'Terminal',
      },
      {
        flags: MenuItemFlags.None,
        id: MenuEntryId.Help,
        keyboardShortCut: 'Alt+h',
        name: 'Help',
      },
    ],
  })
})

test('dispose', () => {
  const state = ViewletTitleBar.create()
  expect(ViewletTitleBar.dispose(state)).toMatchObject({
    disposed: true,
  })
})

test('resize', () => {
  const state = ViewletTitleBar.create()
  const newState = ViewletTitleBar.resize(state, {
    top: 200,
    left: 200,
    width: 200,
    height: 200,
  })
  expect(newState).toEqual({
    disposed: false,
    height: 200,
    left: 200,
    titleBarEntries: [],
    titleBarButtons: [],
    top: 200,
    width: 200,
  })
})

test('handleTitleBarClickMinimize', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  const state = {
    ...ViewletTitleBar.create(),
    width: 900,
    left: 0,
  }
  await ViewletTitleBar.handleTitleBarClickMinimize(state)
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith('ElectronWindow.minimize')
})

test('handleTitleBarClickToggleMaximize', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  const state = {
    ...ViewletTitleBar.create(),
    width: 900,
    left: 0,
  }
  await ViewletTitleBar.handleTitleBarClickToggleMaximize(state)
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith('ElectronWindow.maximize')
})

test('handleTitleBarClickClose', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  const state = {
    ...ViewletTitleBar.create(),
    width: 900,
    left: 0,
  }
  await ViewletTitleBar.handleTitleBarClickClose(state)
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith('ElectronWindow.close')
})
