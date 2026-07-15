import { beforeEach, expect, jest, test } from '@jest/globals'

const editorWorkerInvoke = jest.fn()
const rendererProcessInvoke = jest.fn()

jest.unstable_mockModule('../src/parts/EditorWorker/EditorWorker.ts', () => {
  return {
    invoke: editorWorkerInvoke,
  }
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: rendererProcessInvoke,
  }
})

const ViewletEditorTextCommands = await import('../src/parts/ViewletEditorText/ViewletEditorTextCommands.js')

beforeEach(() => {
  jest.resetAllMocks()
  for (const key of Object.keys(ViewletEditorTextCommands.Commands)) {
    delete ViewletEditorTextCommands.Commands[key]
  }
})

test('getCommands registers worker commands, sub-widget commands, and local commands', async () => {
  editorWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'Editor.getCommandIds':
        return ['cursorLeft', 'type']
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })

  const commands = await ViewletEditorTextCommands.getCommands()

  expect(editorWorkerInvoke).toHaveBeenCalledWith('Editor.getCommandIds')
  expect(commands).toBe(ViewletEditorTextCommands.Commands)
  expect(commands.cursorLeft).toBeDefined()
  expect(commands.type).toBeDefined()
  expect(commands['FindWidget.close']).toBeDefined()
  expect(commands['ColorPicker.handleSliderPointerDown']).toBeDefined()
  expect(commands.showOverlayMessage).toBeDefined()
  expect(commands.hotReload).toBeDefined()
})

test('worker command wrapper invokes editor command, diff, and render', async () => {
  const editor = {
    uid: 42,
    commands: [],
  }
  editorWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'Editor.getCommandIds':
        return ['cursorLeft']
      case 'Editor.cursorLeft':
        return undefined
      case 'Editor.diff2':
        return [1]
      case 'Editor.render2':
        return [['Viewlet.send', 42, 'setDeltaY', 0]]
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })

  const commands = await ViewletEditorTextCommands.getCommands()
  const result = await commands.cursorLeft(editor, 'arg')

  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(1, 'Editor.getCommandIds')
  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(2, 'Editor.cursorLeft', 42, 'arg')
  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(3, 'Editor.diff2', 42)
  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(4, 'Editor.render2', 42, [1])
  expect(result).toEqual({
    ...editor,
    commands: [['Viewlet.send', 42, 'setDeltaY', 0]],
  })
})
