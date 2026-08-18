// @ts-nocheck
import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/EditorWorker/EditorWorker.ts', () => ({
  invoke: jest.fn<(...args: any[]) => Promise<any>>(),
}))

const EditorWorker = await import('../src/parts/EditorWorker/EditorWorker.ts')
const WrapEditorCommands = await import('../src/parts/WrapEditorCommands/WrapEditorCommands.js')
const ViewletStates = await import('../src/parts/ViewletStates/ViewletStates.js')

beforeEach(() => {
  jest.clearAllMocks()
  ViewletStates.reset()
})

test('does not serialize find widget intents', async () => {
  let resolveOpen: (() => void) | undefined
  EditorWorker.invoke.mockImplementation((method: string) => {
    if (method === 'Editor.openFind') {
      return new Promise<void>((resolve) => {
        resolveOpen = resolve
      })
    }
    if (method === 'Editor.diff2') {
      return Promise.resolve([])
    }
    if (method === 'Editor.render2') {
      return Promise.resolve([])
    }
    return Promise.resolve(undefined)
  })
  const editor = { uid: 1 }
  const open = WrapEditorCommands.wrapEditorCommand('openFind')
  const close = WrapEditorCommands.wrapEditorCommand('closeFind')

  const opening = open(editor)
  await Promise.resolve()
  const closing = close(editor)
  await Promise.resolve()

  expect(EditorWorker.invoke).toHaveBeenCalledWith('Editor.closeFind', 1)
  resolveOpen!()
  await Promise.all([opening, closing])
})

test('renders every text editor showing the same uri', async () => {
  ViewletStates.set(2, {
    factory: {},
    moduleId: 'Editor',
    renderedState: { uid: 2 },
    state: {
      uid: 2,
      uri: 'file:///same.txt',
    },
  })
  EditorWorker.invoke.mockImplementation((method: string, uid: number) => {
    if (method === 'Editor.getKeys') {
      return Promise.resolve(['1', '2'])
    }
    if (method === 'Editor.diff2') {
      return Promise.resolve([uid])
    }
    if (method === 'Editor.render2') {
      return Promise.resolve(uid === 1 ? [['setText', 'left']] : [['setText', 'right']])
    }
    return Promise.resolve(undefined)
  })
  const type = WrapEditorCommands.wrapEditorCommand('type')

  const result = await type({ uid: 1, uri: 'file:///same.txt' }, 'x')

  expect(EditorWorker.invoke).toHaveBeenCalledWith('Editor.diff2', 1)
  expect(EditorWorker.invoke).toHaveBeenCalledWith('Editor.diff2', 2)
  expect(result.commands).toEqual([
    ['setText', 'left'],
    ['Viewlet.send', 2, 'setText', 'right'],
  ])
})

test('renders pending state for every text editor showing the same uri', async () => {
  ViewletStates.set(2, {
    factory: {},
    moduleId: 'Editor',
    renderedState: { uid: 2 },
    state: {
      uid: 2,
      uri: 'file:///same.txt',
    },
  })
  EditorWorker.invoke.mockImplementation((method: string, uid: number) => {
    if (method === 'Editor.getKeys') {
      return Promise.resolve(['1', '2'])
    }
    if (method === 'Editor.diff2') {
      return Promise.resolve([uid])
    }
    if (method === 'Editor.render2') {
      return Promise.resolve(uid === 1 ? [['setText', 'left']] : [['setText', 'right']])
    }
    throw new Error(`unexpected method ${method}`)
  })

  const result = await WrapEditorCommands.renderPendingEditors({ uid: 1, uri: 'file:///same.txt' })

  expect(result.commands).toEqual([
    ['setText', 'left'],
    ['Viewlet.send', 2, 'setText', 'right'],
  ])
})

test('ignores an editor disposed while rendering pending state', async () => {
  EditorWorker.invoke.mockImplementation((method: string) => {
    if (method === 'Editor.diff2') {
      return Promise.reject(new Error('Editor not found'))
    }
    if (method === 'Editor.getKeys') {
      return Promise.resolve([])
    }
    throw new Error(`unexpected method ${method}`)
  })

  const result = await WrapEditorCommands.renderPendingEditors({ uid: 1, uri: 'file:///same.txt' })

  expect(result.commands).toEqual([])
  expect(EditorWorker.invoke).not.toHaveBeenCalledWith('Editor.render2', 1, expect.anything())
})

test('rethrows a render error when the editor still exists', async () => {
  const renderError = new Error('render failed')
  EditorWorker.invoke.mockImplementation((method: string) => {
    if (method === 'Editor.diff2') {
      return Promise.reject(renderError)
    }
    if (method === 'Editor.getKeys') {
      return Promise.resolve(['1'])
    }
    throw new Error(`unexpected method ${method}`)
  })

  await expect(WrapEditorCommands.renderPendingEditors({ uid: 1, uri: 'file:///same.txt' })).rejects.toBe(renderError)
})

test('renders one hundred text editors showing the same uri', async () => {
  for (let uid = 1; uid <= 100; uid++) {
    ViewletStates.set(uid, {
      factory: {},
      moduleId: 'Editor',
      renderedState: { uid },
      state: {
        uid,
        uri: 'file:///same.txt',
      },
    })
  }
  EditorWorker.invoke.mockImplementation((method: string, uid: number) => {
    if (method === 'Editor.getKeys') {
      return Promise.resolve(Array.from({ length: 100 }, (_, index) => String(index + 1)))
    }
    if (method === 'Editor.diff2') {
      return Promise.resolve([uid])
    }
    if (method === 'Editor.render2') {
      return Promise.resolve([['setText', `editor-${uid}`]])
    }
    return Promise.resolve(undefined)
  })
  const type = WrapEditorCommands.wrapEditorCommand('type')

  const result = await type({ uid: 50, uri: 'file:///same.txt' }, 'x')

  for (let uid = 1; uid <= 100; uid++) {
    expect(EditorWorker.invoke).toHaveBeenCalledWith('Editor.diff2', uid)
    expect(EditorWorker.invoke).toHaveBeenCalledWith('Editor.render2', uid, [uid])
  }
  expect(result.commands).toHaveLength(100)
  expect(result.commands[0]).toEqual(['setText', 'editor-50'])
  expect(result.commands[1]).toEqual(['Viewlet.send', 1, 'setText', 'editor-1'])
  expect(result.commands.at(-1)).toEqual(['Viewlet.send', 100, 'setText', 'editor-100'])
})

test('does not render a text editor showing another uri', async () => {
  ViewletStates.set(2, {
    factory: {},
    moduleId: 'Editor',
    renderedState: { uid: 2 },
    state: {
      uid: 2,
      uri: 'file:///other.txt',
    },
  })
  EditorWorker.invoke.mockImplementation((method: string) => {
    if (method === 'Editor.diff2' || method === 'Editor.render2') {
      return Promise.resolve([])
    }
    return Promise.resolve(undefined)
  })
  const type = WrapEditorCommands.wrapEditorCommand('type')

  await type({ uid: 1, uri: 'file:///same.txt' }, 'x')

  expect(EditorWorker.invoke).not.toHaveBeenCalledWith('Editor.diff2', 2)
})

test('does not render a sibling removed by an editor lifecycle command', async () => {
  ViewletStates.set(2, {
    factory: {},
    moduleId: 'Editor',
    renderedState: { uid: 2 },
    state: {
      uid: 2,
      uri: 'file:///same.txt',
    },
  })
  EditorWorker.invoke.mockImplementation((method: string) => {
    if (method === 'Editor.getKeys') {
      return Promise.resolve(['1'])
    }
    if (method === 'Editor.diff2' || method === 'Editor.render2') {
      return Promise.resolve([])
    }
    return Promise.resolve(undefined)
  })
  const save = WrapEditorCommands.wrapEditorCommand('save')

  await save({ uid: 1, uri: 'file:///same.txt' })

  expect(EditorWorker.invoke).toHaveBeenCalledWith('Editor.diff2', 1)
  expect(EditorWorker.invoke).not.toHaveBeenCalledWith('Editor.diff2', 2)
})

test('preserves global sibling render commands', async () => {
  ViewletStates.set(2, {
    factory: {},
    moduleId: 'Editor',
    renderedState: { uid: 2 },
    state: {
      uid: 2,
      uri: 'file:///same.txt',
    },
  })
  EditorWorker.invoke.mockImplementation((method: string, uid: number) => {
    if (method === 'Editor.getKeys') {
      return Promise.resolve(['1', '2'])
    }
    if (method === 'Editor.diff2') {
      return Promise.resolve([uid])
    }
    if (method === 'Editor.render2') {
      return Promise.resolve(uid === 1 ? [] : [['Viewlet.setFocusContext', 2, 1]])
    }
    return Promise.resolve(undefined)
  })
  const focus = WrapEditorCommands.wrapEditorCommand('handleFocus')

  const result = await focus({ uid: 1, uri: 'file:///same.txt' })

  expect(result.commands).toEqual([['Viewlet.setFocusContext', 2, 1]])
})
