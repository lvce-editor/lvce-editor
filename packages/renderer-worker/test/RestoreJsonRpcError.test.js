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
    stack:
      "TypeError: Cannot set properties of undefined (setting 'id')\n    at Module.setFocusedIndex (/packages/renderer-process/src/parts/ViewletExplorer/ViewletExplorer.js:179:20)\n    at invoke",
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

test('invoke - error - DOMException', () => {
  const error = RestoreJsonRpcError.restoreJsonRpcError({
    type: ErrorType.DomException,
    name: 'AbortError',
    message: 'The user aborted a request.',
  })
  expect(error).toBeInstanceOf(DOMException)
  expect(error.name).toBe('AbortError')
  expect(error.message).toBe(`The user aborted a request.`)
})

test('invoke - error - with stack', () => {
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
    at constructError`
  )
})

test('invoke - error - ExecError', () => {
  const error = RestoreJsonRpcError.restoreJsonRpcError({
    message: 'Failed to execute test-source-control: process exited with code 128',
    name: 'ExecError',
    stack:
      'ExecError: Failed to execute test-source-control: process exited with code 128\n    at Api.api.exec (test://packages/extension-host-worker/src/parts/ExtensionHostMockExec/ExtensionHostMockExec.js:13:15)\n    at async Object.getChangedFiles (test://packages/extension-host-worker-tests/fixtures/sample.source-control-provider-exec/main.js:7:5)\n    at async getChangedFiles (test://packages/extension-host-worker/src/parts/ExtensionHostSourceControl/ExtensionHostSourceControl.js:20:24)\n    at async Module.getResponse (test://packages/extension-host-worker/src/parts/GetResponse/GetResponse.js:7:20)\n    at async MessagePort.handleMessage (test://packages/extension-host-worker/src/parts/Rpc/Rpc.js:25:24)',
    type: 'ExecError',
  })
  expect(error).toBeInstanceOf(Error)
  expect(error.message).toBe(`Failed to execute test-source-control: process exited with code 128`)
  expect(error.stack).toMatch(
    'ExecError: Failed to execute test-source-control: process exited with code 128\n    at Api.api.exec (test://packages/extension-host-worker/src/parts/ExtensionHostMockExec/ExtensionHostMockExec.js:13:15)\n    at async Object.getChangedFiles (test://packages/extension-host-worker-tests/fixtures/sample.source-control-provider-exec/main.js:7:5)\n    at async getChangedFiles (test://packages/extension-host-worker/src/parts/ExtensionHostSourceControl/ExtensionHostSourceControl.js:20:24)\n    at async Module.getResponse (test://packages/extension-host-worker/src/parts/GetResponse/GetResponse.js:7:20)\n    at async MessagePort.handleMessage (test://packages/extension-host-worker/src/parts/Rpc/Rpc.js:25:24)'
  )
  expect(error.name).toBe('ExecError')
})

test.skip('invoke - error - with only one line in stack', async () => {
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
    at constructError`
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
