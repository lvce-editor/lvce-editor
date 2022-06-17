import { jest } from '@jest/globals'
import * as ErrorHandling from '../src/parts/ErrorHandling/ErrorHandling.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'

test('handleError - normal error', async () => {
  const mockError = new Error('oops')
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
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
        throw new Error('unexpected message')
    }
  })
  await ErrorHandling.handleError(mockError)
  expect(spy).toHaveBeenCalledWith(mockError)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    /* Notification.create */ 991,
    'error',
    {
      codeFrame: undefined,
      message: 'Error: oops',
      stack: undefined,
      category: undefined,
    },
  ])
})

test('handleError - null', async () => {
  const mockError = null
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
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
        throw new Error('unexpected message')
    }
  })
  await ErrorHandling.handleError(mockError)
  expect(spy).toHaveBeenCalledWith(mockError)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    /* Notification.create */ 991,
    'error',
    {
      codeFrame: undefined,
      message: 'Error: null',
      stack: undefined,
    },
  ])
})

test('handleError - multiple causes', async () => {
  const mockError1 = new Error(
    'SyntaxError: Unexpected token , in JSON at position 7743'
  )
  // @ts-ignore
  const mockError2 = new Error('Failed to load url /keyBindings.json', {
    cause: mockError1,
  })
  // @ts-ignore
  const mockError3 = new Error('Failed to load keybindings', {
    cause: mockError2,
  })
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
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
        throw new Error('unexpected message')
    }
  })
  await ErrorHandling.handleError(mockError3)
  expect(spy).toHaveBeenCalledWith(mockError3)
  expect(spy).toHaveBeenCalledWith(mockError2)
  expect(spy).toHaveBeenCalledWith(mockError1)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    /* Notification.create */ 991,
    'error',
    {
      codeFrame: undefined,
      message:
        'Error: Failed to load keybindings: Error: Failed to load url /keyBindings.json: Error: SyntaxError: Unexpected token , in JSON at position 7743',
      stack: undefined,
      category: undefined,
    },
  ])
})
