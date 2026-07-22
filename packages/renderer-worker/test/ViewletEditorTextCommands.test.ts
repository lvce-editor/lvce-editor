import { beforeEach, expect, jest, test } from '@jest/globals'

const commandExecute = jest.fn()
const editorWorkerInvoke = jest.fn()
const rendererProcessInvoke = jest.fn()

jest.unstable_mockModule('../src/parts/EditorWorker/EditorWorker.ts', () => {
  return {
    invoke: editorWorkerInvoke,
  }
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({
  execute: commandExecute,
}))

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
  expect(commands.handleUriChange).toBeDefined()
  expect(commands.loadContentLater).toBeDefined()
  expect(commands.showOverlayMessage).toBeDefined()
  expect(commands.hotReload).toBeDefined()
})

test('loadContentLater requests diagnostics after the initial render', async () => {
  editorWorkerInvoke.mockImplementation((method) => {
    if (method === 'Editor.getCommandIds') {
      return []
    }
    throw new Error(`unexpected method ${method}`)
  })
  const commands = await ViewletEditorTextCommands.getCommands()

  await commands.loadContentLater({ uid: 42 })

  expect(commandExecute).toHaveBeenCalledWith('Viewlet.executeViewletCommand', 42, 'updateDiagnostics')
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

test('worker command wrapper serializes command, diff, and render per editor', async () => {
  const editor = {
    commands: [],
    uid: 42,
  }
  const { promise: firstCommand, resolve: resolveFirstCommand } = Promise.withResolvers<void>()
  let diffCount = 0
  editorWorkerInvoke.mockImplementation(async (method, uid, argument) => {
    switch (method) {
      case 'Editor.diff2':
        return [++diffCount]
      case 'Editor.getCommandIds':
        return ['handleWheel']
      case 'Editor.handleWheel':
        return argument === 'first' ? firstCommand : undefined
      case 'Editor.render2':
        return [[method, uid, argument]]
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })

  const commands = await ViewletEditorTextCommands.getCommands()
  const first = commands.handleWheel(editor, 'first')
  const second = commands.handleWheel(editor, 'second')

  await Promise.resolve()
  expect(editorWorkerInvoke).toHaveBeenCalledTimes(2)
  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(2, 'Editor.handleWheel', 42, 'first')

  resolveFirstCommand()
  await Promise.all([first, second])

  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(3, 'Editor.diff2', 42)
  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(4, 'Editor.render2', 42, [1])
  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(5, 'Editor.handleWheel', 42, 'second')
  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(6, 'Editor.diff2', 42)
  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(7, 'Editor.render2', 42, [2])
})

test('handleUriChange skips the duplicated viewlet uid and updates the renderer editor uri', async () => {
  const editor = {
    uid: 42,
    uri: '/test/original.txt',
  }
  editorWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'Editor.getCommandIds':
        return ['handleUriChange']
      case 'Editor.handleUriChange':
        return undefined
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })

  const commands = await ViewletEditorTextCommands.getCommands()
  const result = await commands.handleUriChange(editor, 42, '/test/renamed.txt')

  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(1, 'Editor.getCommandIds')
  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(2, 'Editor.handleUriChange', 42, '/test/renamed.txt')
  expect(result).toEqual({
    ...editor,
    uri: '/test/renamed.txt',
  })
})
