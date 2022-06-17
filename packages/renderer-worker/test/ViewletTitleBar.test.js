import { jest } from '@jest/globals'
import * as ViewletTitleBar from '../src/parts/Viewlet/ViewletTitleBar.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'

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
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        console.log(message)
        throw new Error('unexpected message (3)')
    }
  })
  await ViewletTitleBar.contentLoaded(state)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(1)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
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
    ],
  ])
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
