import * as JsonRpcVersion from '../src/parts/JsonRpcVersion/JsonRpcVersion.js'
const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)

const Callback = await import('../src/parts/Callback/Callback.js')

class NoErrorThrownError extends Error {}

const getError = async (promise) => {
  try {
    await promise
    throw new NoErrorThrownError()
  } catch (error) {
    return error
  }
}

test('invoke - error', async () => {
  RendererProcess.state.ipc = {
    send(message) {
      Callback.resolve(message.id, {
        jsonrpc: JsonRpcVersion.Two,
        error: {
          message:
            'Test failed: sample.tab-completion-provider: expected selector .Viewlet.Editor to have text "test3" but was "test"',
          stack: `Error: expected selector .Viewlet.Editor to have text "test3" but was "test"
    at Object.checkSingleElementCondition [as TestFrameWork.checkSingleElementCondition] (http://localhost/packages/renderer-process/src/parts/TestFrameWork/TestFrameWork.js:122:9)
    at async Worker.handleMessageFromRendererWorker (http://localhost/packages/renderer-process/src/parts/RendererWorker/RendererWorker.js:46:24)`,
        },
      })
    },
  }
  const error = await getError(
    RendererProcess.invoke(
      'TestFrameWork.checkSingleElementCondition',
      {
        _selector: '.Viewlet.Editor',
        _nth: -1,
        _hasText: '',
      },

      'toHaveText',
      {
        text: 'test3',
      }
    )
  )
  expect(error).toBeInstanceOf(Error)
  // @ts-ignore
  expect(error.message).toBe(
    `Test failed: sample.tab-completion-provider: expected selector .Viewlet.Editor to have text \"test3\" but was \"test\"`
  )
  // TODO constructError stack is not really relevant, should only include stack from
  // rendererprocess.invoke onwards
  // @ts-ignore
  expect(error.stack).toMatch(
    `Error: expected selector .Viewlet.Editor to have text \"test3\" but was \"test\"
    at Object.checkSingleElementCondition [as TestFrameWork.checkSingleElementCondition] (http://localhost/packages/renderer-process/src/parts/TestFrameWork/TestFrameWork.js:122:9)
    at async Worker.handleMessageFromRendererWorker (http://localhost/packages/renderer-process/src/parts/RendererWorker/RendererWorker.js:46:24)
    at constructError`
  )
})

export {}
