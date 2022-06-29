import { jest } from '@jest/globals'

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

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)
const ViewletTitleBar = await import('../src/parts/Viewlet/ViewletTitleBar.js')

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
        flags: 0,
        id: 'file',
        name: 'File',
      },
      {
        flags: 0,
        id: 'edit',
        name: 'Edit',
      },
      {
        flags: 0,
        id: 'selection',
        name: 'Selection',
      },
      {
        flags: 0,
        id: 'view',
        name: 'View',
      },
      {
        flags: 0,
        id: 'go',
        name: 'Go',
      },
      {
        flags: 0,
        id: 'run',
        keyboardShortCut: 'Alt+r',
        name: 'Run',
      },
      {
        flags: 0,
        id: 'terminal',
        keyboardShortCut: 'Alt+t',
        name: 'Terminal',
      },
      {
        flags: 0,
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
        flags: 0,
        id: 'file',
        name: 'File',
      },
      {
        flags: 0,
        id: 'edit',
        name: 'Edit',
      },
      {
        flags: 0,
        id: 'selection',
        name: 'Selection',
      },
      {
        flags: 0,
        id: 'view',
        name: 'View',
      },
      {
        flags: 0,
        id: 'go',
        name: 'Go',
      },
      {
        flags: 0,
        id: 'run',
        keyboardShortCut: 'Alt+r',
        name: 'Run',
      },
      {
        flags: 0,
        id: 'terminal',
        keyboardShortCut: 'Alt+t',
        name: 'Terminal',
      },
      {
        flags: 0,
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
    3024,
    'TitleBar',
    'menuSetEntries',
    [
      {
        flags: 0,
        id: 'file',
        name: 'File',
      },
      {
        flags: 0,
        id: 'edit',
        name: 'Edit',
      },
      {
        flags: 0,
        id: 'selection',
        name: 'Selection',
      },
      {
        flags: 0,
        id: 'view',
        name: 'View',
      },
      {
        flags: 0,
        id: 'go',
        name: 'Go',
      },
      {
        flags: 0,
        id: 'run',
        keyboardShortCut: 'Alt+r',
        name: 'Run',
      },
      {
        flags: 0,
        id: 'terminal',
        keyboardShortCut: 'Alt+t',
        name: 'Terminal',
      },
      {
        flags: 0,
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
