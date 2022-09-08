import { jest } from '@jest/globals'
import * as MenuItemFlags from '../src/parts/MenuItemFlags/MenuItemFlags.js'

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

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)
const ViewletTitleBar = await import(
  '../src/parts/ViewletTitleBar/ViewletTitleBar.js'
)

test('name', () => {
  expect(ViewletTitleBar.name).toBe('TitleBar')
})

test('create', () => {
  const state = ViewletTitleBar.create()
  expect(state).toBeDefined()
})

test('loadContent', async () => {
  const state = ViewletTitleBar.create()
  expect(await ViewletTitleBar.loadContent(state)).toEqual({
    disposed: false,
    titleBarEntries: [
      {
        flags: MenuItemFlags.None,
        id: 'file',
        name: 'File',
      },
      {
        flags: MenuItemFlags.None,
        id: 'edit',
        name: 'Edit',
      },
      {
        flags: MenuItemFlags.None,
        id: 'selection',
        name: 'Selection',
      },
      {
        flags: MenuItemFlags.None,
        id: 'view',
        name: 'View',
      },
      {
        flags: MenuItemFlags.None,
        id: 'go',
        name: 'Go',
      },
      {
        flags: MenuItemFlags.None,
        id: 'run',
        keyboardShortCut: 'Alt+r',
        name: 'Run',
      },
      {
        flags: MenuItemFlags.None,
        id: 'terminal',
        keyboardShortCut: 'Alt+t',
        name: 'Terminal',
      },
      {
        flags: MenuItemFlags.None,
        id: 'help',
        keyboardShortCut: 'Alt+h',
        name: 'Help',
      },
    ],
  })
})

test('contentLoaded', async () => {
  const state = {
    ...ViewletTitleBar.create(),
    titleBarEntries: [
      {
        flags: MenuItemFlags.None,
        id: 'file',
        name: 'File',
      },
      {
        flags: MenuItemFlags.None,
        id: 'edit',
        name: 'Edit',
      },
      {
        flags: MenuItemFlags.None,
        id: 'selection',
        name: 'Selection',
      },
      {
        flags: MenuItemFlags.None,
        id: 'view',
        name: 'View',
      },
      {
        flags: MenuItemFlags.None,
        id: 'go',
        name: 'Go',
      },
      {
        flags: MenuItemFlags.None,
        id: 'run',
        keyboardShortCut: 'Alt+r',
        name: 'Run',
      },
      {
        flags: MenuItemFlags.None,
        id: 'terminal',
        keyboardShortCut: 'Alt+t',
        name: 'Terminal',
      },
      {
        flags: MenuItemFlags.None,
        id: 'help',
        keyboardShortCut: 'Alt+h',
        name: 'Help',
      },
    ],
  }
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ViewletTitleBar.contentLoaded(state)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.send',
    'TitleBar',
    'menuSetEntries',
    [
      {
        flags: MenuItemFlags.None,
        id: 'file',
        name: 'File',
      },
      {
        flags: MenuItemFlags.None,
        id: 'edit',
        name: 'Edit',
      },
      {
        flags: MenuItemFlags.None,
        id: 'selection',
        name: 'Selection',
      },
      {
        flags: MenuItemFlags.None,
        id: 'view',
        name: 'View',
      },
      {
        flags: MenuItemFlags.None,
        id: 'go',
        name: 'Go',
      },
      {
        flags: MenuItemFlags.None,
        id: 'run',
        keyboardShortCut: 'Alt+r',
        name: 'Run',
      },
      {
        flags: MenuItemFlags.None,
        id: 'terminal',
        keyboardShortCut: 'Alt+t',
        name: 'Terminal',
      },
      {
        flags: MenuItemFlags.None,
        id: 'help',
        keyboardShortCut: 'Alt+h',
        name: 'Help',
      },
    ]
  )
})

test('dispose', () => {
  const state = ViewletTitleBar.create()
  expect(ViewletTitleBar.dispose(state)).toEqual({
    disposed: true,
    titleBarEntries: [],
  })
})

test('resize', () => {
  const state = ViewletTitleBar.create()
  const { newState } = ViewletTitleBar.resize(state, {
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
    top: 200,
    width: 200,
  })
})
