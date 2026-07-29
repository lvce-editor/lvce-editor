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
    moduleId: 'EditorText',
    renderedState: { uid: 2 },
    state: {
      uid: 2,
      uri: 'file:///same.txt',
    },
  })
  EditorWorker.invoke.mockImplementation((method: string, uid: number) => {
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

test('does not render a text editor showing another uri', async () => {
  ViewletStates.set(2, {
    factory: {},
    moduleId: 'EditorText',
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

test('preserves global sibling render commands', async () => {
  ViewletStates.set(2, {
    factory: {},
    moduleId: 'EditorText',
    renderedState: { uid: 2 },
    state: {
      uid: 2,
      uri: 'file:///same.txt',
    },
  })
  EditorWorker.invoke.mockImplementation((method: string, uid: number) => {
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
