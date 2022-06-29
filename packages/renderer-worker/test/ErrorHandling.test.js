import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RendererProcess/RendererProcess.js',
  () => {
    return {
      invoke: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)
const ErrorHandling = await import(
  '../src/parts/ErrorHandling/ErrorHandling.js'
)

test('handleError - normal error', async () => {
  const mockError = new Error('oops')
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})

  await ErrorHandling.handleError(mockError)
  expect(spy).toHaveBeenCalledWith(mockError)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    /* Notification.create */ 991,
    'error',
    {
      codeFrame: undefined,
      message: 'Error: oops',
      stack: undefined,
      category: undefined,
    }
  )
})

test('handleError - null', async () => {
  const mockError = null
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ErrorHandling.handleError(mockError)
  expect(spy).toHaveBeenCalledWith(mockError)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    /* Notification.create */ 991,
    'error',
    {
      codeFrame: undefined,
      message: 'Error: null',
      stack: undefined,
    }
  )
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
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ErrorHandling.handleError(mockError3)
  expect(spy).toHaveBeenCalledWith(mockError3)
  expect(spy).toHaveBeenCalledWith(mockError2)
  expect(spy).toHaveBeenCalledWith(mockError1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    /* Notification.create */ 991,
    'error',
    {
      codeFrame: undefined,
      message:
        'Error: Failed to load keybindings: Error: Failed to load url /keyBindings.json: Error: SyntaxError: Unexpected token , in JSON at position 7743',
      stack: undefined,
      category: undefined,
    }
  )
})
