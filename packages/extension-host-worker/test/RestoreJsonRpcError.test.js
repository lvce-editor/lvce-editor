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

test('restoreJsonRpcError - DOMException - DataCloneError', () => {
  const error = RestoreJsonRpcError.restoreJsonRpcError({
    type: ErrorType.DomException,
    name: 'DataCloneError',
    message: "Failed to execute 'postMessage' on 'MessagePort': Value at index 0 does not have a transferable type.",
    stack: `Error: Failed to execute 'postMessage' on 'MessagePort': Value at index 0 does not have a transferable type.
    at Object.send (http://localhost:3000/packages/renderer-worker/src/parts/IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug/IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.js:19:14)
    at handleMessageMethod (http://localhost:3000/packages/renderer-worker/src/parts/ExtensionHostRpc/ExtensionHostRpc.js:24:24)`,
  })
  expect(error).toBeInstanceOf(DOMException)
  expect(error.name).toBe('DataCloneError')
  expect(error.message).toBe("Failed to execute 'postMessage' on 'MessagePort': Value at index 0 does not have a transferable type.")
  expect(error.stack).toMatch(`Error: Failed to execute 'postMessage' on 'MessagePort': Value at index 0 does not have a transferable type.
    at Object.send (http://localhost:3000/packages/renderer-worker/src/parts/IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug/IpcParentWithModuleWorkerAndWorkaroundForChromeDevtoolsBug.js:19:14)
    at handleMessageMethod (http://localhost:3000/packages/renderer-worker/src/parts/ExtensionHostRpc/ExtensionHostRpc.js:24:24)
    at Module.restoreJsonRpcError`)
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
    at Module.restoreJsonRpcError`
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
    `Failed to get all preferences: failed to get user preferences: Failed to read file \"/test/.config/app/settings.json\": EACCES: permission denied, open '/test/.config/app/settings.json'`
  )
  expect(error.stack).toMatch(
    `Failed to get all preferences: failed to get user preferences: Failed to read file \"/test/.config/app/settings.json\": EACCES: permission denied, open '/test/.config/app/settings.json'
    at getUserPreferences (file:///test/packages/shared-process/src/parts/Preferences/Preferences.js:23:11)
    at async Object.getAll [as Preferences.getAll] (file:///test/packages/shared-process/src/parts/Preferences/Preferences.js:63:29)
    at async Module.getResponse (file:///test/packages/shared-process/src/parts/GetResponse/GetResponse.js:21:9)
    at async WebSocket.handleMessage (file:///test/packages/shared-process/src/parts/Socket/Socket.js:32:22)`
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
    at async MessagePort.handleMessage (test://packages/extension-host-worker/src/parts/Rpc/Rpc.js:25:24)`
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
    'Failed to execute tab completion provider: VError: invalid tab completion result: tabCompletion must be of type object but is 42'
  )
  expect(error.stack).toMatch(
    `VError: invalid tab completion result: tabCompletion must be of type object but is 42
    at executeTabCompletionProvider (test://packages/extension-host-worker/src/parts/Registry/Registry.js:77:17)
    at async Module.getResponse (test://packages/extension-host-worker/src/parts/GetResponse/GetResponse.js:7:20)
    at async MessagePort.handleMessage (test://packages/extension-host-worker/src/parts/Rpc/Rpc.js:25:24)`
  )
  expect(error.name).toBe('Error')
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

test('restoreJsonRpcError - object', () => {
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
  expect(error.message).toBe('JsonRpc Error: [object Object]')
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
