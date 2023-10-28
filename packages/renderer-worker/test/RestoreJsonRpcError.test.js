import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.js'
import * as ErrorType from '../src/parts/ErrorType/ErrorType.js'
import * as RestoreJsonRpcError from '../src/parts/RestoreJsonRpcError/RestoreJsonRpcError.js'

test('restoreJsonRpcError - string', () => {
  const error = RestoreJsonRpcError.restoreJsonRpcError('something went wrong')
  expect(error).toBeInstanceOf(Error)
  expect(error.message).toBe('JsonRpc Error: something went wrong')
})

test('restoreJsonRpcError - TypeError', () => {
  const error = RestoreJsonRpcError.restoreJsonRpcError({
    type: ErrorType.TypeError,
    message: 'x is not a function',
  })
  expect(error).toBeInstanceOf(TypeError)
  expect(error.message).toBe('x is not a function')
})

test('restoreJsonRpcError - TypeError object', () => {
  const error = RestoreJsonRpcError.restoreJsonRpcError({
    message: "Cannot set properties of undefined (setting 'id')",
    stack: `TypeError: Cannot set properties of undefined (setting 'id')
    at Module.setFocusedIndex (/packages/renderer-process/src/parts/ViewletExplorer/ViewletExplorer.js:179:20)
    at invoke`,
    name: 'TypeError',
    type: 'TypeError',
  })
  expect(error).toBeInstanceOf(TypeError)
  expect(error.message).toBe(`Cannot set properties of undefined (setting 'id')`)
})

test('restoreJsonRpcError - SyntaxError', () => {
  const error = RestoreJsonRpcError.restoreJsonRpcError({
    type: ErrorType.SyntaxError,
    message: 'unexpected token',
  })
  expect(error).toBeInstanceOf(SyntaxError)
  expect(error.message).toBe('unexpected token')
})

test('restoreJsonRpcError - ReferenceError', () => {
  const error = RestoreJsonRpcError.restoreJsonRpcError({
    type: ErrorType.ReferenceError,
    message: 'x is not defined',
  })
  expect(error).toBeInstanceOf(ReferenceError)
  expect(error.message).toBe('x is not defined')
})

test('restoreJsonRpcError - null', () => {
  const error = RestoreJsonRpcError.restoreJsonRpcError(null)
  expect(error.message).toBe('JsonRpc Error: null')
})

test('restoreJsonRpcError - empty object', async () => {
  const error = RestoreJsonRpcError.restoreJsonRpcError({})
  expect(error.message).toBe(`JsonRpc Error: [object Object]`)
})

test('restoreJsonRpcError - empty array', async () => {
  const error = RestoreJsonRpcError.restoreJsonRpcError([])
  expect(error.message).toBe(`JsonRpc Error: `)
})

test('restoreJsonRpcError - empty weakmap', async () => {
  const error = RestoreJsonRpcError.restoreJsonRpcError(new WeakMap())
  expect(error.message).toBe(`JsonRpc Error: [object WeakMap]`)
})

test('restoreJsonRpcError - empty set', async () => {
  const error = RestoreJsonRpcError.restoreJsonRpcError(new Set())
  expect(error.message).toBe(`JsonRpc Error: [object Set]`)
})

test('restoreJsonRpcError - DOMException', () => {
  const error = RestoreJsonRpcError.restoreJsonRpcError({
    type: ErrorType.DomException,
    name: 'AbortError',
    message: 'The user aborted a request.',
  })
  expect(error).toBeInstanceOf(DOMException)
  expect(error.name).toBe('AbortError')
  expect(error.message).toBe(`The user aborted a request.`)
})

test('restoreJsonRpcError - with stack', () => {
  const error = RestoreJsonRpcError.restoreJsonRpcError({
    message: 'Test failed: sample.tab-completion-provider: expected selector .Viewlet.Editor to have text "test3" but was "test"',
    stack: `Error: expected selector .Viewlet.Editor to have text "test3" but was "test"
    at Object.checkSingleElementCondition [as TestFrameWork.checkSingleElementCondition] (http://localhost/packages/renderer-process/src/parts/TestFrameWork/TestFrameWork.js:122:9)
    at async Worker.handleMessageFromRendererWorker (http://localhost/packages/renderer-process/src/parts/RendererWorker/RendererWorker.js:46:24)`,
  })
  expect(error).toBeInstanceOf(Error)
  expect(error.message).toBe(`Test failed: sample.tab-completion-provider: expected selector .Viewlet.Editor to have text \"test3\" but was \"test\"`)
  expect(error.stack).toMatch(
    `Error: expected selector .Viewlet.Editor to have text \"test3\" but was \"test\"
    at Object.checkSingleElementCondition [as TestFrameWork.checkSingleElementCondition] (http://localhost/packages/renderer-process/src/parts/TestFrameWork/TestFrameWork.js:122:9)
    at async Worker.handleMessageFromRendererWorker (http://localhost/packages/renderer-process/src/parts/RendererWorker/RendererWorker.js:46:24)
    at constructError`,
  )
})

test('restoreJsonRpcError - with stack in data property', () => {
  const error = RestoreJsonRpcError.restoreJsonRpcError({
    code: -32001,
    message:
      'Failed to get all preferences: failed to get user preferences: Failed to read file "/test/.config/app/settings.json": EACCES: permission denied, open \'/test/.config/app/settings.json\'',
    data: {
      stack: `Failed to get all preferences: failed to get user preferences: Failed to read file \"/test/.config/app/settings.json\": EACCES: permission denied, open '/test/.config/app/settings.json'
    at getUserPreferences (file:///test/packages/shared-process/src/parts/Preferences/Preferences.js:23:11)
    at async Object.getAll [as Preferences.getAll] (file:///test/packages/shared-process/src/parts/Preferences/Preferences.js:63:29)
    at async Module.getResponse (file:///test/packages/shared-process/src/parts/GetResponse/GetResponse.js:21:9)
    at async WebSocket.handleMessage (file:///test/packages/shared-process/src/parts/Socket/Socket.js:32:22)`,
      codeFrame: `  21 |   } catch (error) {
  22 |     // @ts-ignore
> 23 |     throw new VError(error, 'failed to get user preferences')
     |           ^
  24 |   }
  25 | }
  26 |`,
    },
  })
  expect(error).toBeInstanceOf(Error)
  expect(error.message).toBe(
    `Failed to get all preferences: failed to get user preferences: Failed to read file \"/test/.config/app/settings.json\": EACCES: permission denied, open '/test/.config/app/settings.json'`,
  )
  expect(error.stack).toMatch(
    `Failed to get all preferences: failed to get user preferences: Failed to read file \"/test/.config/app/settings.json\": EACCES: permission denied, open '/test/.config/app/settings.json'
    at getUserPreferences (file:///test/packages/shared-process/src/parts/Preferences/Preferences.js:23:11)
    at async Object.getAll [as Preferences.getAll] (file:///test/packages/shared-process/src/parts/Preferences/Preferences.js:63:29)
    at async Module.getResponse (file:///test/packages/shared-process/src/parts/GetResponse/GetResponse.js:21:9)
    at async WebSocket.handleMessage (file:///test/packages/shared-process/src/parts/Socket/Socket.js:32:22)`,
  )
})

test('restoreJsonRpcError - ExecError', () => {
  const error = RestoreJsonRpcError.restoreJsonRpcError({
    message: 'Failed to execute test-source-control: process exited with code 128',
    name: 'ExecError',
    stack: `ExecError: Failed to execute test-source-control: process exited with code 128
    at Api.api.exec (test://packages/extension-host-worker/src/parts/ExtensionHostMockExec/ExtensionHostMockExec.js:13:15)
    at async Object.getChangedFiles (test://packages/extension-host-worker-tests/fixtures/sample.source-control-provider-exec/main.js:7:5)
    at async getChangedFiles (test://packages/extension-host-worker/src/parts/ExtensionHostSourceControl/ExtensionHostSourceControl.js:20:24)
    at async Module.getResponse (test://packages/extension-host-worker/src/parts/GetResponse/GetResponse.js:7:20)
    at async MessagePort.handleMessage (test://packages/extension-host-worker/src/parts/Rpc/Rpc.js:25:24)`,
    type: 'ExecError',
  })
  expect(error).toBeInstanceOf(Error)
  expect(error.message).toBe(`Failed to execute test-source-control: process exited with code 128`)
  expect(error.stack).toMatch(
    `ExecError: Failed to execute test-source-control: process exited with code 128
    at Api.api.exec (test://packages/extension-host-worker/src/parts/ExtensionHostMockExec/ExtensionHostMockExec.js:13:15)
    at async Object.getChangedFiles (test://packages/extension-host-worker-tests/fixtures/sample.source-control-provider-exec/main.js:7:5)
    at async getChangedFiles (test://packages/extension-host-worker/src/parts/ExtensionHostSourceControl/ExtensionHostSourceControl.js:20:24)
    at async Module.getResponse (test://packages/extension-host-worker/src/parts/GetResponse/GetResponse.js:7:20)
    at async MessagePort.handleMessage (test://packages/extension-host-worker/src/parts/Rpc/Rpc.js:25:24)`,
  )
  expect(error.name).toBe('ExecError')
})

test('restoreJsonRpcError - VError', () => {
  const error = RestoreJsonRpcError.restoreJsonRpcError({
    message: 'Failed to execute tab completion provider: VError: invalid tab completion result: tabCompletion must be of type object but is 42',
    stack: `VError: invalid tab completion result: tabCompletion must be of type object but is 42
    at executeTabCompletionProvider (test://packages/extension-host-worker/src/parts/Registry/Registry.js:77:17)
    at async Module.getResponse (test://packages/extension-host-worker/src/parts/GetResponse/GetResponse.js:7:20)
    at async MessagePort.handleMessage (test://packages/extension-host-worker/src/parts/Rpc/Rpc.js:25:24)`,
    name: 'VError',
    type: 'VError',
  })
  expect(error).toBeInstanceOf(Error)
  expect(error.message).toBe(
    'Failed to execute tab completion provider: VError: invalid tab completion result: tabCompletion must be of type object but is 42',
  )
  expect(error.stack).toMatch(
    `VError: invalid tab completion result: tabCompletion must be of type object but is 42
    at executeTabCompletionProvider (test://packages/extension-host-worker/src/parts/Registry/Registry.js:77:17)
    at async Module.getResponse (test://packages/extension-host-worker/src/parts/GetResponse/GetResponse.js:7:20)
    at async MessagePort.handleMessage (test://packages/extension-host-worker/src/parts/Rpc/Rpc.js:25:24)`,
  )
  expect(error.name).toBe('Error')
})

test.skip('restoreJsonRpcError - with only one line in stack', async () => {
  const ipc = {
    send: jest.fn((message) => {
      // @ts-ignore
      if (message.method === 'Test.execute') {
        // @ts-ignore
        Callback.resolve(message.id, {
          error: {
            message: 'The user aborted a request.',
            name: 'AbortError',
            stack: 'Error: The user aborted a request.',
            type: 'DOMException',
          },
        })
      } else {
        throw new Error('unexpected message')
      }
    }),
  }
  const error = await getError(JsonRpc.invoke(ipc, 'Test.execute', 'test message'))
  expect(error).toBeInstanceOf(DOMException)
  expect(error.message).toBe('The user aborted a request.')
  expect(error.stack).toMatch(
    `Error: expected selector .Viewlet.Editor to have text \"test3\" but was \"test\"
    at Object.checkSingleElementCondition [as TestFrameWork.checkSingleElementCondition] (http://localhost/packages/renderer-process/src/parts/TestFrameWork/TestFrameWork.js:122:9)
    at async Worker.handleMessageFromRendererWorker (http://localhost/packages/renderer-process/src/parts/RendererWorker/RendererWorker.js:46:24)
    at constructError`,
  )
})

test.skip('restoreJsonRpcError - method not found', async () => {
  const error = RestoreJsonRpcError.restoreJsonRpcError({
    message: 'method not found',
    code: JsonRpcErrorCode.MethodNotFound,
    data: '',
  })
  expect(error).toBeInstanceOf(JsonRpcError)
  expect(error.message).toBe('method not found')
})

test('restoreJsonRpcError - error without stack', () => {
  const error = RestoreJsonRpcError.restoreJsonRpcError({
    code: -32001,
    message: "FileNotFoundError: File not found '0.8510013488176322'",
  })
  expect(error).toBeInstanceOf(Error)
  expect(error.message).toBe("FileNotFoundError: File not found '0.8510013488176322'")
  expect(error.stack).toMatch(`FileNotFoundError: File not found '0.8510013488176322'`)
  expect(error.name).toBe('Error')
})

test('restoreJsonRpcError - error with code', () => {
  const error = RestoreJsonRpcError.restoreJsonRpcError({
    code: -32001,
    message: "FileNotFoundError: File not found '/test/settings.json'",
    data: {
      code: ErrorCodes.ENOENT,
    },
  })
  expect(error).toBeInstanceOf(Error)
  expect(error.message).toBe("FileNotFoundError: File not found '/test/settings.json'")
  expect(error.stack).toMatch(`Error: FileNotFoundError: File not found '/test/settings.json'
    at constructError`)
  // @ts-ignore
  expect(error.code).toBe(ErrorCodes.ENOENT)
})

test.skip('restoreJsonRpcError - object', () => {
  const error = RestoreJsonRpcError.restoreJsonRpcError({
    jsonrpc: '2.0',
    id: 7,
    error: {
      code: -32001,
      message: 'expected value to be of type string',
      data: {
        stack: `    at Object.getColorThemeJson [as ExtensionHost.getColorThemeJson] (file:///test/packages/shared-process/src/parts/ExtensionManagement/ExtensionManagementColorTheme.js:32:10)
    at executeCommandAsync (file:///test/packages/shared-process/src/parts/Command/Command.js:68:33)
    at async getResponse (file:///test/packages/shared-process/src/parts/GetResponse/GetResponse.js:21:9)
    at async WebSocket.handleMessage (file:///test/packages/shared-process/src/parts/Socket/Socket.js:27:22)`,
        codeFrame: `  30 |
  31 | export const getColorThemeJson = async (colorThemeId) => {
> 32 |   Assert.string(colorThemeId)
      |          ^
  33 |   const extensions = await ExtensionManagement.getExtensions()
  34 |   const colorThemePath = await getColorThemePath(extensions, colorThemeId)
  35 |   if (!colorThemePath) {`,
        type: 'AssertionError',
      },
    },
  })
  expect(error).toBeInstanceOf(Error)
  expect(error.message).toBe('JsonRpcError: [object Object]')
})

test('restoreJsonRpcError - AssertionError', () => {
  const error = RestoreJsonRpcError.restoreJsonRpcError({
    code: -32001,
    message: 'expected value to be of type string',
    data: {
      stack: `    at Object.getColorThemeJson [as ExtensionHost.getColorThemeJson] (file:///test/packages/shared-process/src/parts/ExtensionManagement/ExtensionManagementColorTheme.js:32:10)
    at executeCommandAsync (file:///test/packages/shared-process/src/parts/Command/Command.js:68:33)
    at async getResponse (file:///test/packages/shared-process/src/parts/GetResponse/GetResponse.js:21:9)
    at async WebSocket.handleMessage (file:///test/packages/shared-process/src/parts/Socket/Socket.js:27:22)`,
      codeFrame: `  30 |
  31 | export const getColorThemeJson = async (colorThemeId) => {
> 32 |   Assert.string(colorThemeId)
      |          ^
  33 |   const extensions = await ExtensionManagement.getExtensions()
  34 |   const colorThemePath = await getColorThemePath(extensions, colorThemeId)
  35 |   if (!colorThemePath) {`,
      type: 'AssertionError',
    },
  })
  expect(error).toBeInstanceOf(Error)
  expect(error.message).toBe('expected value to be of type string')
  expect(error.stack).toMatch(`AssertionError: expected value to be of type string
    at Object.getColorThemeJson [as ExtensionHost.getColorThemeJson] (file:///test/packages/shared-process/src/parts/ExtensionManagement/ExtensionManagementColorTheme.js:32:10)
    at executeCommandAsync (file:///test/packages/shared-process/src/parts/Command/Command.js:68:33)
    at async getResponse (file:///test/packages/shared-process/src/parts/GetResponse/GetResponse.js:21:9)
    at async WebSocket.handleMessage (file:///test/packages/shared-process/src/parts/Socket/Socket.js:27:22)
    at Module.restoreJsonRpcError `)
})

test('restoreJsonRpcError - ReferenceError with codeFrame', () => {
  const error = RestoreJsonRpcError.restoreJsonRpcError({
    message: 'Failed to execute completion provider: ReferenceError: vscode is not defined',
    stack: `    at getTsPosition (/test/language-features-typescript/packages/node/src/parts/Position/Position.js:4:20)
    at getCompletion (/test/language-features-typescript/packages/node/src/parts/Completion/Completion.js:61:31)
    at execute (/test/language-features-typescript/packages/node/src/parts/Command/Command.js:7:10)
    at getResponse (/test/lvce-editor/packages/extension-host-helper-process/src/parts/GetResponse/GetResponse.js:6:26)
    at handleMessage (/test/lvce-editor/packages/extension-host-helper-process/src/parts/Rpc/Rpc.js:6:42)
    at WebSocket.wrappedListener (/test/lvce-editor/packages/extension-host-helper-process/src/parts/IpcChildWithWebSocket/IpcChildWithWebSocket.js:27:13)
    at Receiver.receiverOnMessage (/test/packages/extension-host-helper-process/node_modules/ws/lib/websocket.js:1180:20)
    at Receiver.dataMessage (/test/packages/extension-host-helper-process/node_modules/ws/lib/receiver.js:541:14)
    at async invoke (http://localhost:3000/remote/test/builtin.language-features-typescript/packages/extension/src/parts/Rpc/Rpc.js:26:3)
    at async provideCompletions (http://localhost:3000/remote/test/builtin.language-features-typescript/packages/extension/src/parts/ExtensionHost/ExtensionHostCompletionProviderTypeScript.js:60:17)
    at async executeCompletionProvider (http://localhost:3000/packages/extension-host-worker/src/parts/Registry/Registry.js:83:24)
    at async getResponse (http://localhost:3000/packages/extension-host-worker/src/parts/GetResponse/GetResponse.js:6:20)
    at async MessagePort.handleMessageFromRendererWorker (http://localhost:3000/packages/extension-host-worker/src/parts/Rpc/Rpc.js:25:24)
    at async executeProviders (http://localhost:3000/packages/renderer-worker/src/parts/ExtensionHost/ExtensionHostShared.js:19:19)
    at async getCompletions (http://localhost:3000/packages/renderer-worker/src/parts/Completions/Completions.js:10:23)
    at async loadContent (http://localhost:3000/packages/renderer-worker/src/parts/ViewletEditorCompletion/ViewletEditorCompletion.js:137:27)
    at async load (http://localhost:3000/packages/renderer-worker/src/parts/ViewletManager/ViewletManager.js:326:20)
    at async openCompletion (http://localhost:3000/packages/renderer-worker/src/parts/EditorCommand/EditorCommandCompletion.js:93:3)
    at async runFn (http://localhost:3000/packages/renderer-worker/src/parts/ViewletManager/ViewletManager.js:44:22)`,
    codeFrame: `  2 |
  3 | export const getTsPosition = (textDocument, offset) => {
> 4 |   const position = vscode.getPosition(textDocument, offset)
    |                    ^
  5 |   return {
  6 |     line: position.rowIndex + 1,
  7 |     offset: position.columnIndex + 1,`,
    type: ErrorType.ReferenceError,
  })
  expect(error).toBeInstanceOf(ReferenceError)
  expect(error.message).toBe('Failed to execute completion provider: ReferenceError: vscode is not defined')
  // @ts-ignore
  expect(error.codeFrame).toBe(`  2 |
  3 | export const getTsPosition = (textDocument, offset) => {
> 4 |   const position = vscode.getPosition(textDocument, offset)
    |                    ^
  5 |   return {
  6 |     line: position.rowIndex + 1,
  7 |     offset: position.columnIndex + 1,`)
  expect(error.stack).toMatch(`    at getTsPosition (/test/language-features-typescript/packages/node/src/parts/Position/Position.js:4:20)
    at getCompletion (/test/language-features-typescript/packages/node/src/parts/Completion/Completion.js:61:31)
    at execute (/test/language-features-typescript/packages/node/src/parts/Command/Command.js:7:10)
    at getResponse (/test/lvce-editor/packages/extension-host-helper-process/src/parts/GetResponse/GetResponse.js:6:26)
    at handleMessage (/test/lvce-editor/packages/extension-host-helper-process/src/parts/Rpc/Rpc.js:6:42)
    at WebSocket.wrappedListener (/test/lvce-editor/packages/extension-host-helper-process/src/parts/IpcChildWithWebSocket/IpcChildWithWebSocket.js:27:13)
    at Receiver.receiverOnMessage (/test/packages/extension-host-helper-process/node_modules/ws/lib/websocket.js:1180:20)
    at Receiver.dataMessage (/test/packages/extension-host-helper-process/node_modules/ws/lib/receiver.js:541:14)
    at async invoke (http://localhost:3000/remote/test/builtin.language-features-typescript/packages/extension/src/parts/Rpc/Rpc.js:26:3)
    at async provideCompletions (http://localhost:3000/remote/test/builtin.language-features-typescript/packages/extension/src/parts/ExtensionHost/ExtensionHostCompletionProviderTypeScript.js:60:17)
    at async executeCompletionProvider (http://localhost:3000/packages/extension-host-worker/src/parts/Registry/Registry.js:83:24)
    at async getResponse (http://localhost:3000/packages/extension-host-worker/src/parts/GetResponse/GetResponse.js:6:20)
    at async MessagePort.handleMessageFromRendererWorker (http://localhost:3000/packages/extension-host-worker/src/parts/Rpc/Rpc.js:25:24)
    at async executeProviders (http://localhost:3000/packages/renderer-worker/src/parts/ExtensionHost/ExtensionHostShared.js:19:19)
    at async getCompletions (http://localhost:3000/packages/renderer-worker/src/parts/Completions/Completions.js:10:23)
    at async loadContent (http://localhost:3000/packages/renderer-worker/src/parts/ViewletEditorCompletion/ViewletEditorCompletion.js:137:27)
    at async load (http://localhost:3000/packages/renderer-worker/src/parts/ViewletManager/ViewletManager.js:326:20)
    at async openCompletion (http://localhost:3000/packages/renderer-worker/src/parts/EditorCommand/EditorCommandCompletion.js:93:3)
    at async runFn (http://localhost:3000/packages/renderer-worker/src/parts/ViewletManager/ViewletManager.js:44:22)`)
})

test('restoreJsonRpcError - command not found error', () => {
  const error = RestoreJsonRpcError.restoreJsonRpcError({
    message: 'command HandleNodeMessagePort.handleNodeMessagePort not found',
    stack: `    at executeCommandAsync (file:///test/packages/shared-process/src/parts/Command/Command.js:66:11)
    at async Module.getResponse (file:///test/packages/shared-process/src/parts/GetResponse/GetResponse.js:10:9)
    at async handleJsonRpcMessage (file:///test/packages/shared-process/src/parts/HandleIpc/HandleIpc.js:12:24)
    at restoreJsonRpcError (/test/packages/main-process/src/parts/RestoreJsonRpcError/RestoreJsonRpcError.js:28:66)
    at unwrapResult (/test/packages/main-process/src/parts/UnwrapJsonRpcResult/UnwrapJsonRpcResult.js:5:47)
    at invokeAndTransfer (/test/packages/main-process/src/parts/JsonRpc/JsonRpc.js:39:38)
    at async connectToIpcNodeWorker (/test/packages/main-process/src/parts/ConnectIpc/ConnectIpc.js:20:3)
    at async handlePort (/test/packages/main-process/src/parts/HandleMessagePortForSharedProcess/HandleMessagePortForSharedProcess.js:48:3)
    at async handlePort (/test/packages/main-process/src/parts/HandleMessagePort/HandleMessagePort.js:44:5)`,
    name: 'Error',
    type: 'Error',
  })
  expect(error).toBeInstanceOf(Error)
  expect(error.message).toBe('command HandleNodeMessagePort.handleNodeMessagePort not found')
  // @ts-ignore
  expect(error.codeFrame).toBeUndefined()
  expect(error.stack).toMatch(`command HandleNodeMessagePort.handleNodeMessagePort not found
    at executeCommandAsync (file:///test/packages/shared-process/src/parts/Command/Command.js:66:11)
    at async Module.getResponse (file:///test/packages/shared-process/src/parts/GetResponse/GetResponse.js:10:9)
    at async handleJsonRpcMessage (file:///test/packages/shared-process/src/parts/HandleIpc/HandleIpc.js:12:24)
    at restoreJsonRpcError (/test/packages/main-process/src/parts/RestoreJsonRpcError/RestoreJsonRpcError.js:28:66)
    at unwrapResult (/test/packages/main-process/src/parts/UnwrapJsonRpcResult/UnwrapJsonRpcResult.js:5:47)
    at invokeAndTransfer (/test/packages/main-process/src/parts/JsonRpc/JsonRpc.js:39:38)
    at async connectToIpcNodeWorker (/test/packages/main-process/src/parts/ConnectIpc/ConnectIpc.js:20:3)
    at async handlePort (/test/packages/main-process/src/parts/HandleMessagePortForSharedProcess/HandleMessagePortForSharedProcess.js:48:3)
    at async handlePort (/test/packages/main-process/src/parts/HandleMessagePort/HandleMessagePort.js:44:5)
    at constructError`)
})

test('restoreJsonRpcError - message string', () => {
  const error = RestoreJsonRpcError.restoreJsonRpcError({
    code: -32601,
    message: "'Location.reload' wasn't found",
  })
  expect(error.message).toBe("'Location.reload' wasn't found")
  expect(error.stack).toMatch(`'Location.reload' wasn't found
    at Module.restoreJsonRpcError`)
})

test('restoreJsonRpcError - TextSearchError', () => {
  const error = RestoreJsonRpcError.restoreJsonRpcError({
    code: -32001,
    message: 'ripgrep path not found: Error: spawn /test/bin/rg ENOENT',
    data: {
      stack: `    at TextSearch.search (/test/packages/shared-process/src/parts/TextSearch/TextSearch.js:124:11)
    at async handleJsonRpcMessage (/test/packages/shared-process/src/parts/HandleJsonRpcMessage/HandleJsonRpcMessage.js:8:24)`,
      codeFrame: `  122 |   const [pipeLineResult, exitResult] = await Promise.all([pipeLinePromise, closePromise])
  123 |   if (exitResult.type === ProcessExitEventType.Error) {
> 124 |     throw new TextSearchError(exitResult.event)
      |           ^
  125 |   }
  126 |   return pipeLineResult
  127 | }`,
      type: 'TextSearchError',
      code: 'E_RIP_GREP_NOT_FOUND',
    },
  })
  expect(error.message).toBe('ripgrep path not found: Error: spawn /test/bin/rg ENOENT')
  expect(error.stack).toMatch(`TextSearchError: ripgrep path not found: Error: spawn /test/bin/rg ENOENT
    at TextSearch.search (/test/packages/shared-process/src/parts/TextSearch/TextSearch.js:124:11)`)
  expect(error.name).toBe('TextSearchError')
})

test('restoreJsonRpcError - bulk replacement error', async () => {
  const error = RestoreJsonRpcError.restoreJsonRpcError({
    code: -32001,
    message: "VError: Bulk replacement failed: File not found: './test.txt'",
    data: {
      code: 'ENOENT',
    },
  })
  expect(error.message).toBe("VError: Bulk replacement failed: File not found: './test.txt'")
  expect(error.stack).toMatch(`Error: VError: Bulk replacement failed: File not found: './test.txt'
    at constructError `)
  expect(error.name).toBe('Error')
})
