import * as EditorShowMessage from '../src/parts/EditorCommand/EditorCommandShowMessage.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'
import { jest } from '@jest/globals'

jest.useFakeTimers()

test('showMessage - should dispose after 3 seconds', async () => {
  const editor = {}
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        console.log(message)
        throw new Error('unexpected message (3)')
    }
  })
  await EditorShowMessage.editorShowMessage(
    editor,
    {
      rowIndex: 0,
      columnIndex: 0,
    },
    'test'
  )
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(1)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    3024,
    'EditorText',
    'showOverlayMessage',
    NaN,
    NaN,
    'test',
  ])

  // TODO use jest fake timers

  // (but not any new timers that get created during that process)
  jest.runOnlyPendingTimers()
  // TODO assert that message has been hidden now
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(2)
  expect(RendererProcess.state.send).toHaveBeenNthCalledWith(2, [
    909090,
    expect.any(Number),
    3024,
    'EditorText',
    'hideOverlayMessage',
  ])
})

// TODO when multiple messages are shown concurrently, only show the last one
