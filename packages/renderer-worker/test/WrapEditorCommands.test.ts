// @ts-nocheck
import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/EditorWorker/EditorWorker.ts', () => ({
  invoke: jest.fn<(...args: any[]) => Promise<any>>(),
}))

const EditorWorker = await import('../src/parts/EditorWorker/EditorWorker.ts')
const WrapEditorCommands = await import('../src/parts/WrapEditorCommands/WrapEditorCommands.js')

beforeEach(() => {
  jest.clearAllMocks()
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
