import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')
const EditorShowMessage = await import('../src/parts/EditorCommand/EditorCommandShowMessage.js')

jest.useFakeTimers()

test('showMessage - should dispose after 3 seconds', async () => {
  const editor = {
    uid: 1,
  }
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await EditorShowMessage.editorShowMessage(editor, /* rowIndex */ 0, /* columnIndex */ 0, /* message */ 'test', /* isError */ false)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('Viewlet.send', 1, 'showOverlayMessage', Number.NaN, Number.NaN, 'test')

  // TODO use jest fake timers

  // (but not any new timers that get created during that process)
  jest.runOnlyPendingTimers()
  // TODO assert that message has been hidden now
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenNthCalledWith(2, 'Viewlet.send', 1, 'hideOverlayMessage')
})

// TODO when multiple messages are shown concurrently, only show the last one
