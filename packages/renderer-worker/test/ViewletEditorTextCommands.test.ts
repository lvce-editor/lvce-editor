import { beforeEach, expect, jest, test } from '@jest/globals'

const commandExecute = jest.fn()
const editorWorkerInvoke = jest.fn()
const rendererProcessInvoke = jest.fn()
const setFocus = jest.fn()

jest.unstable_mockModule('../src/parts/Focus/Focus.js', () => ({ setFocus }))

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
const Languages = await import('../src/parts/Languages/Languages.js')

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
  expect(commands['ColorPicker.handleColorAreaPointerDown']).toBeDefined()
  expect(commands['ColorPicker.handleColorAreaPointerMove']).toBeDefined()
  expect(commands['ColorPicker.handleColorAreaPointerUp']).toBeDefined()
  expect(commands['ColorPicker.handleContextMenu']).toBeDefined()
  expect(commands['ColorPicker.handleSliderKeyDown']).toBeDefined()
  expect(commands['ColorPicker.handleSliderPointerDown']).toBeDefined()
  expect(commands['ColorPicker.handleSliderPointerMove']).toBeDefined()
  expect(commands['ColorPicker.handleSliderPointerUp']).toBeDefined()
  expect(commands.handleUriChange).toBeDefined()
  expect(commands.loadContentLater).toBeDefined()
  expect(commands.__renderPending).toBeDefined()
  expect(commands.renderPending).toBeDefined()
  expect(commands.showOverlayMessage).toBeDefined()
  expect(commands.hotReload).toBeDefined()
})

test('a DOM focus event selects its application editor even if the worker returns no focus diff', async () => {
  editorWorkerInvoke.mockImplementation((method) => (method === 'Editor.getCommandIds' || method === 'Editor.renderDirect2' ? [] : undefined))
  const commands = await ViewletEditorTextCommands.getCommands()
  await commands.handleFocus({ uid: 42, applicationId: 'source', uri: 'memfs:///main.ts' })
  expect(setFocus).toHaveBeenCalledWith(12, undefined, 42, 'Editor')
  expect(editorWorkerInvoke).toHaveBeenCalledWith('Editor.handleFocus', 42)
})

test('color picker slider escape closes the picker', async () => {
  const editor = {
    commands: [],
    uid: 42,
  }
  editorWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'Editor.closeColorPicker':
        return undefined
      case 'Editor.getCommandIds':
        return []
      case 'Editor.renderDirect2':
        return [['Viewlet.focus', 42]]
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })

  const commands = await ViewletEditorTextCommands.getCommands()
  const result = await commands['ColorPicker.handleSliderKeyDown'](editor, 'ColorPicker', 'ColorPicker.handleSliderKeyDown', 42, 7, 'Escape')

  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(2, 'Editor.closeColorPicker', 42)
  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(3, 'Editor.renderDirect2', 42, false)
  expect(result.commands).toEqual([['Viewlet.focus', 42]])
})

test('color picker slider navigation keys continue to execute the widget command', async () => {
  const editor = {
    commands: [],
    uid: 42,
  }
  editorWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'Editor.executeWidgetCommand':
        return undefined
      case 'Editor.getCommandIds':
        return []
      case 'Editor.renderDirect2':
        return []
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })

  const commands = await ViewletEditorTextCommands.getCommands()
  await commands['ColorPicker.handleSliderKeyDown'](editor, 'ColorPicker', 'ColorPicker.handleSliderKeyDown', 42, 7, 'ArrowRight')

  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(
    2,
    'Editor.executeWidgetCommand',
    42,
    'ColorPicker',
    'ColorPicker.handleSliderKeyDown',
    42,
    7,
    'ArrowRight',
  )
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

test('renderPending renders editor-worker state changed by an asynchronous effect', async () => {
  const editor = {
    commands: [],
    uid: 42,
  }
  editorWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'Editor.getCommandIds':
        return []
      case 'Editor.renderDirect2':
        return [['Viewlet.createFunctionalRoot', 'EditorCompletion', 99, true]]
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })

  const commands = await ViewletEditorTextCommands.getCommands()
  const result = await commands.__renderPending(editor)

  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(2, 'Editor.renderDirect2', 42, true)
  expect(result).toEqual({
    ...editor,
    commands: [['Viewlet.createFunctionalRoot', 'EditorCompletion', 99, true]],
  })
})

test('worker command wrapper invokes editor command and direct rendering', async () => {
  const editor = {
    commands: [],
    uid: 42,
  }
  editorWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'Editor.cursorLeft':
        return undefined
      case 'Editor.getCommandIds':
        return ['cursorLeft']
      case 'Editor.renderDirect2':
        return [['Viewlet.send', 42, 'setDeltaY', 0]]
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })

  const commands = await ViewletEditorTextCommands.getCommands()
  const result = await commands.cursorLeft(editor, 'arg')

  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(1, 'Editor.getCommandIds')
  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(2, 'Editor.cursorLeft', 42, 'arg')
  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(3, 'Editor.renderDirect2', 42, false)
  expect(result).toEqual({
    ...editor,
    commands: [['Viewlet.send', 42, 'setDeltaY', 0]],
  })
})

test('worker command wrapper serializes command and direct rendering per editor', async () => {
  const editor = {
    commands: [],
    uid: 42,
  }
  const { promise: firstCommand, resolve: resolveFirstCommand } = Promise.withResolvers<void>()
  editorWorkerInvoke.mockImplementation(async (method, uid, argument) => {
    switch (method) {
      case 'Editor.getCommandIds':
        return ['handleWheel']
      case 'Editor.handleWheel':
        return argument === 'first' ? firstCommand : undefined
      case 'Editor.renderDirect2':
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

  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(3, 'Editor.renderDirect2', 42, false)
  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(4, 'Editor.handleWheel', 42, 'second')
  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(5, 'Editor.renderDirect2', 42, false)
})

test('handleUriChange skips the duplicated viewlet uid and updates the renderer editor uri', async () => {
  const editor = {
    languageId: 'unknown',
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

test('handleUriChange updates the language from the saved file extension', async () => {
  Languages.addLanguage({
    extensions: ['.c'],
    id: 'c',
    tokenize: '/tokenize-c.js',
  })
  const editor = {
    languageId: 'unknown',
    uid: 42,
    uri: 'untitled:///1',
  }
  editorWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'Editor.getCommandIds':
        return ['handleUriChange']
      case 'Editor.handleUriChange':
      case 'Editor.setLanguageId':
        return undefined
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })

  const commands = await ViewletEditorTextCommands.getCommands()
  const result = await commands.handleUriChange(editor, 42, 'file:///tmp/file.c')

  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(1, 'Editor.getCommandIds')
  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(2, 'Editor.handleUriChange', 42, 'file:///tmp/file.c')
  expect(editorWorkerInvoke).toHaveBeenNthCalledWith(3, 'Editor.setLanguageId', 42, 'c', '/tokenize-c.js')
  expect(result).toEqual({
    ...editor,
    languageId: 'c',
    uri: 'file:///tmp/file.c',
  })
})

test('background loadContent keeps content updates but suppresses focus commands', async () => {
  editorWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'Editor.getCommandIds':
        return ['loadContent']
      case 'Editor.loadContent':
        return undefined
      case 'Editor.renderDirect2':
        return [
          ['Viewlet.setDom2', 42, []],
          ['Viewlet.focusSelector', 42, '[name="editor"]'],
          ['Viewlet.setFocusContext', 42, 1],
          ['Viewlet.setAdditionalFocus', 42, 2],
          ['Viewlet.send', 42, 'setFocused', true],
          ['Viewlet.setPatches', 42, []],
        ]
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })
  const commands = await ViewletEditorTextCommands.getCommands()
  const result = await commands.loadContent({ uid: 42 }, undefined, { preserveFocus: true })
  expect(result.commands).toEqual([
    ['Viewlet.setDom2', 42, []],
    ['Viewlet.setPatches', 42, []],
  ])
})

test('workspace refresh reloads the matching editor from disk without stealing focus', async () => {
  const editor = { uid: 42, uri: 'file:///workspace/src/main.ts' }
  editorWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'Editor.getCommandIds':
        return ['loadContent']
      case 'Editor.loadContent':
        return undefined
      case 'Editor.renderDirect2':
        return [
          ['Viewlet.setPatches', 42, []],
          ['Viewlet.focusSelector', 42, '[name="editor"]'],
        ]
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })
  const commands = await ViewletEditorTextCommands.getCommands()
  const unchanged = await commands.handleWorkspaceRefresh(editor, { changed: [editor.uri] })
  expect(unchanged).toBe(editor)
  expect(editorWorkerInvoke).not.toHaveBeenCalledWith('Editor.loadContent', 42, undefined, false, true, true)
  const unrelated = await commands.handleWorkspaceRefresh(editor, { changed: ['file:///workspace/other.ts'], reloadContent: true })
  expect(unrelated).toBe(editor)

  const result = await commands.handleWorkspaceRefresh(editor, { changed: [editor.uri], reloadContent: true })
  expect(editorWorkerInvoke).toHaveBeenCalledWith('Editor.loadContent', 42, undefined, false, true, true)
  expect(result.commands).toEqual([['Viewlet.setPatches', 42, []]])
})

test('background reload also suppresses focus in diagnostic renders before the reload returns', async () => {
  const editor = { uid: 42, uri: 'live-component-state:///1.json' }
  const focusCommands = [['Viewlet.focusSelector', 42, '[name="editor"]']]
  const contentCommands = [['Viewlet.setPatches', 42, []]]
  let pendingCommands: unknown
  editorWorkerInvoke.mockImplementation(async (method) => {
    switch (method) {
      case 'Editor.getCommandIds':
        return ['loadContent']
      case 'Editor.loadContent':
        pendingCommands = (await commands.__renderPending(editor)).commands
        return undefined
      case 'Editor.renderDirect2':
        return [...contentCommands, ...focusCommands]
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })
  const commands = await ViewletEditorTextCommands.getCommands()
  await commands.loadContent(editor, undefined, { preserveFocus: true })
  expect(pendingCommands).toEqual(contentCommands)
  // Normal navigation can focus the editor again after the background reload.
  await commands.loadContent(editor)
  expect(pendingCommands).toEqual([...contentCommands, ...focusCommands])
})

test('failed background reloads leave idle diagnostic renders unable to steal focus', async () => {
  const editor = { uid: 42 }
  editorWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'Editor.getCommandIds':
        return ['loadContent']
      case 'Editor.loadContent':
        throw new Error('reload failed')
      case 'Editor.renderDirect2':
        return [['Viewlet.focusSelector', 42, '[name="editor"]']]
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })
  const commands = await ViewletEditorTextCommands.getCommands()
  await expect(commands.loadContent(editor, undefined, { preserveFocus: true })).rejects.toThrow('reload failed')
  expect((await commands.__renderPending(editor)).commands).toEqual([])
})

test('diagnostic renders after a background reload preserve focus while navigation can still focus the editor', async () => {
  const editor = { uid: 42, uri: 'live-component-state:///1.json' }
  const focusCommands = [['Viewlet.focusSelector', 42, '[name="editor"]']]
  const contentCommands = [['Viewlet.setPatches', 42, []]]
  editorWorkerInvoke.mockImplementation((method) => {
    switch (method) {
      case 'Editor.getCommandIds':
        return ['loadContent', 'updateDiagnostics']
      case 'Editor.loadContent':
      case 'Editor.updateDiagnostics':
        return undefined
      case 'Editor.renderDirect2':
        return [...contentCommands, ...focusCommands]
      default:
        throw new Error(`unexpected method ${method}`)
    }
  })
  const commands = await ViewletEditorTextCommands.getCommands()
  await commands.loadContent(editor, undefined, { preserveFocus: true })
  expect((await commands.__renderPending(editor)).commands).toEqual(contentCommands)
  expect((await commands.updateDiagnostics(editor)).commands).toEqual(contentCommands)
  expect((await commands.loadContent(editor)).commands).toEqual([...contentCommands, ...focusCommands])
})

test('refreshing all gutter decorations does not require or forward an active editor', async () => {
  editorWorkerInvoke.mockImplementation(async (method) => (method === 'Editor.getCommandIds' ? ['refreshGutterDecorationsAll'] : undefined))
  const commands = await ViewletEditorTextCommands.getCommands()
  editorWorkerInvoke.mockClear()
  expect(commands.refreshGutterDecorationsAll.requiresInstance).toBe(false)
  await commands.refreshGutterDecorationsAll()
  expect(editorWorkerInvoke).toHaveBeenCalledTimes(1)
  expect(editorWorkerInvoke).toHaveBeenCalledWith('Editor.refreshGutterDecorationsAll')
})

test('application auto-closing dispatch uses the editor command state contract', async () => {
  const ApplicationRegistry = await import('../src/parts/ApplicationRegistry/ApplicationRegistry.ts')
  const ViewletManager = await import('../src/parts/ViewletManager/ViewletManager.js')
  const ViewletStates = await import('../src/parts/ViewletStates/ViewletStates.js')
  editorWorkerInvoke.mockImplementation((method) => {
    if (method === 'Editor.getCommandIds') return ['typeWithAutoClosing']
    if (method === 'Editor.diff2' || method === 'Editor.renderDirect2') return []
    return undefined
  })
  const commands = await ViewletEditorTextCommands.getCommands()
  const editor = { applicationId: 'preview', uid: 42, uri: 'memfs:///example.txt' }
  ApplicationRegistry.create({ href: '/samples', id: 'preview', layoutUid: 100, workspacePath: '/', workspaceUri: 'memfs:///' })
  ViewletStates.set(42, {
    factory: { ...ViewletEditorTextCommands, Commands: commands, hasFunctionalRender: false },
    moduleId: 'Editor',
    renderedState: editor,
    state: editor,
  })
  try {
    await expect(ViewletManager.executeForApplication('preview', 'Editor.typeWithAutoClosing', '/')).resolves.toEqual({ ...editor, commands: [] })
    expect(editorWorkerInvoke).toHaveBeenCalledWith('Editor.typeWithAutoClosing', 42, '/')
  } finally {
    ViewletStates.remove(42)
    await ApplicationRegistry.remove('preview')
  }
})

test('refreshes hosted editor preferences after registration before requesting diagnostics', async () => {
  editorWorkerInvoke.mockImplementation(async () => [])
  const commands = await ViewletEditorTextCommands.getCommands()
  await commands.loadContentLater({ uid: 42, applicationId: 'preview' })
  expect(commandExecute.mock.calls).toEqual([
    ['Viewlet.executeViewletCommand', 42, 'handleSettingsChanged'],
    ['Viewlet.executeViewletCommand', 42, 'updateDiagnostics'],
  ])
})

test('standalone editor deferred loading keeps the existing diagnostics route', async () => {
  editorWorkerInvoke.mockImplementation(async () => [])
  const commands = await ViewletEditorTextCommands.getCommands()
  await commands.loadContentLater({ uid: 42 })
  expect(commandExecute.mock.calls).toEqual([['Viewlet.executeViewletCommand', 42, 'updateDiagnostics']])
})

test('late hosted DOM focus responses preserve the newer application focus', async () => {
  const pendingSource = Promise.withResolvers<void>()
  const sourceStarted = Promise.withResolvers<void>()
  editorWorkerInvoke.mockImplementation(async (method, uid) => {
    if (method === 'Editor.getCommandIds') return []
    if (method === 'Editor.handleFocus' && uid === 42) {
      sourceStarted.resolve()
      await pendingSource.promise
    }
    if (method === 'Editor.renderDirect2')
      return [
        ['Viewlet.focusSelector', uid, '.EditorInput textarea'],
        ['Viewlet.setText', uid, 'updated'],
      ]
    return undefined
  })
  const commands = await ViewletEditorTextCommands.getCommands()
  const source = commands.handleFocus({ uid: 42, applicationId: 'source', uri: 'memfs:///main.ts' })
  await sourceStarted.promise
  const preview = await commands.handleFocus({ uid: 43, applicationId: 'preview', uri: 'memfs:///example.txt' })
  pendingSource.resolve()
  const lateSource = await source
  expect(preview.commands).toEqual([['Viewlet.setText', 43, 'updated']])
  expect(lateSource.commands).toEqual([['Viewlet.setText', 42, 'updated']])
  expect(setFocus.mock.calls).toEqual([
    [12, undefined, 42, 'Editor'],
    [12, undefined, 43, 'Editor'],
  ])
})

test('a standalone DOM focus event selects its editor without refocusing it later', async () => {
  editorWorkerInvoke.mockImplementation(async (method, uid) => {
    if (method === 'Editor.getCommandIds') return []
    if (method === 'Editor.renderDirect2') return [['Viewlet.focusSelector', uid, '.EditorInput textarea']]
    return undefined
  })
  const commands = await ViewletEditorTextCommands.getCommands()
  const result = await commands.handleFocus({ uid: 42, uri: 'file:///main.ts' })
  expect(result.commands).toEqual([])
  expect(setFocus).toHaveBeenCalledWith(12, undefined, 42, 'Editor')
})

test('a DOM focus event selects the desktop editor before its worker reply', async () => {
  const worker = Promise.withResolvers<void>()
  editorWorkerInvoke.mockImplementation((method) => {
    if (method === 'Editor.getCommandIds') return []
    if (method === 'Editor.renderDirect2')
      return [
        ['Viewlet.setFocusContext', 42, 12],
        ['Viewlet.focusSelector', 42, '.EditorInput textarea'],
      ]
    if (method === 'Editor.handleFocus') return worker.promise
    throw new Error(`unexpected method ${method}`)
  })
  const commands = await ViewletEditorTextCommands.getCommands()
  const pending = commands.handleFocus({ uid: 42, uri: 'file:///right.txt' })
  try {
    expect(setFocus).toHaveBeenCalledWith(12, undefined, 42, 'Editor')
  } finally {
    worker.resolve()
    const result = await pending
    expect(result.commands).toEqual([])
  }
})

test('layout resize retains initial patches and returns inline patches without queueing a transaction', async () => {
  const initial = ['Viewlet.setPatches', 42, ['initial']]
  const resized = ['Viewlet.setPatches', 42, ['resized']]
  editorWorkerInvoke.mockImplementation((method) => {
    if (method === 'Editor.getCommandIds') return ['resize']
    if (method === 'Editor.diff2') return []
    if (method === 'Editor.render2') return [resized]
    if (method === 'Editor.resize') return undefined
    throw new Error(`unexpected method ${method}`)
  })
  const commands = await ViewletEditorTextCommands.getCommands()
  const dimensions = { x: 20, y: 30, width: 400, height: 200 }
  const editor = { uid: 42, id: 42, commands: [initial], useFunctionalRendering: true, lines: [], deltaY: 0, itemHeight: 20, rowHeight: 20 }
  const result = await commands.resize(editor, dimensions)
  expect(result).toMatchObject(dimensions)
  expect(result.commands).toEqual([initial, resized])
  expect(editorWorkerInvoke).toHaveBeenCalledWith('Editor.resize', 42, dimensions)
  expect(editorWorkerInvoke).not.toHaveBeenCalledWith('Editor.renderDirect2', expect.anything(), expect.anything())
})

test('pointer focus is emitted even when the worker reports no focus change', async () => {
  editorWorkerInvoke.mockImplementation((method) => {
    if (method === 'Editor.getCommandIds') return ['handleMouseDown']
    if (method === 'Editor.renderDirect2') return []
    if (method === 'Editor.handleMouseDownAndRender') return []
    throw new Error(`unexpected method ${method}`)
  })
  const commands = await ViewletEditorTextCommands.getCommands()
  const result = await commands.handleMouseDown({ uid: 42, uri: 'memfs:///pointer.ts' }, 0, false, false, 40, 80, 1, false)
  expect(editorWorkerInvoke).toHaveBeenCalledWith('Editor.handleMouseDownAndRender', 42, 0, false, false, 40, 80, 1, false)
  expect(result.commands).toContainEqual(['Viewlet.focusSelector', 42, '.EditorInput textarea'])
})

test('pointer listeners prevent native blur while other listener options are retained', async () => {
  const Render = await import('../src/parts/ViewletEditorText/ViewletEditorTextRender.js')
  expect(Render.immediateCommands).toEqual(['handleMouseDown'])
  const pointer = { name: 18, params: ['handleMouseDown'], stopPropagation: true }
  const input = { name: 20, params: ['handleBeforeInput'], preventDefault: true }
  editorWorkerInvoke.mockImplementation(() => [pointer, input])
  expect(await Render.renderEventListeners()).toEqual([{ ...pointer, preventDefault: true }, input])
})

test('a delayed standalone focus reply cannot refocus the previously active split', async () => {
  const slow = Promise.withResolvers<void>()
  editorWorkerInvoke.mockImplementation(async (method, uid) => {
    if (method === 'Editor.getCommandIds') return []
    if (method === 'Editor.handleFocus' && uid === 41) await slow.promise
    if (method === 'Editor.renderDirect2')
      return [
        ['Viewlet.focusSelector', uid, '.EditorInput textarea'],
        ['Viewlet.setText', uid, 'updated'],
      ]
    return undefined
  })
  const commands = await ViewletEditorTextCommands.getCommands()
  const oldFocus = commands.handleFocus({ uid: 41, uri: 'file:///left.txt' })
  const current = await commands.handleFocus({ uid: 42, uri: 'file:///right.txt' })
  slow.resolve()
  const stale = await oldFocus
  expect(current.commands).toEqual([['Viewlet.setText', 42, 'updated']])
  expect(stale.commands).toEqual([['Viewlet.setText', 41, 'updated']])
  expect(setFocus.mock.calls).toEqual([
    [12, undefined, 41, 'Editor'],
    [12, undefined, 42, 'Editor'],
  ])
})

test('an explicitly targeted color picker reaches the worker through the registered viewlet command', async () => {
  const GetActiveEditor = await import('../src/parts/GetActiveEditor/GetActiveEditor.js')
  const Viewlet = await import('../src/parts/Viewlet/Viewlet.js')
  const ViewletStates = await import('../src/parts/ViewletStates/ViewletStates.js')
  const Applications = await import('../src/parts/ApplicationRegistry/ApplicationRegistry.ts')
  editorWorkerInvoke.mockImplementation(async (method) => {
    if (method === 'Editor.getCommandIds') return ['openColorPicker']
    if (method === 'Editor.renderDirect2') return []
    return undefined
  })
  commandExecute.mockImplementation((command, ...args) => {
    if (command !== 'Viewlet.executeViewletCommand') throw new Error(`Unexpected command: ${command}`)
    return Viewlet.executeViewletCommand(args[0], args[1], ...args.slice(2))
  })
  Applications.create({ id: 'preview', layoutUid: 200, href: '', workspacePath: '', workspaceUri: 'memfs:///' })
  try {
    const state = { id: 42, uid: 42, uri: 'memfs:///target.css', applicationId: 'preview' }
    const factory = { name: 'EditorText', Commands: await ViewletEditorTextCommands.getCommands() }
    ViewletStates.set(42, { moduleId: 'EditorText', factory, state, renderedState: state })
    await GetActiveEditor.openColorPicker(42, '#ff8800', 'preview')
    expect(editorWorkerInvoke).toHaveBeenCalledWith('Editor.openColorPicker', 42, '#ff8800')
    expect(editorWorkerInvoke).toHaveBeenCalledWith('Editor.renderDirect2', 42, false)
  } finally {
    ViewletStates.remove(42)
    Applications.remove('preview')
  }
})
