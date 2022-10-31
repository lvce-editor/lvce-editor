import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Notification/Notification.js', () => {
  return {
    create: jest.fn(() => {}),
  }
})

const Notification = await import('../src/parts/Notification/Notification.js')
const ErrorHandling = await import(
  '../src/parts/ErrorHandling/ErrorHandling.js'
)

test('handleError - normal error', async () => {
  const mockError = new Error('oops')
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  await ErrorHandling.handleError(mockError)
  expect(spy).toHaveBeenCalledWith(mockError)
  expect(Notification.create).toHaveBeenCalledTimes(1)
  expect(Notification.create).toHaveBeenCalledWith('error', 'Error: oops')
})

test('handleError - null', async () => {
  const mockError = null
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  await ErrorHandling.handleError(mockError)
  expect(spy).toHaveBeenCalledWith(mockError)
  expect(Notification.create).toHaveBeenCalledTimes(1)
  expect(Notification.create).toHaveBeenCalledWith('error', 'Error: null')
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
  await ErrorHandling.handleError(mockError3)
  expect(spy).toHaveBeenCalledWith(mockError3)
  expect(spy).toHaveBeenCalledWith(mockError2)
  expect(spy).toHaveBeenCalledWith(mockError1)
  expect(Notification.create).toHaveBeenCalledWith(
    'error',
    'Error: Failed to load keybindings: Error: Failed to load url /keyBindings.json: Error: SyntaxError: Unexpected token , in JSON at position 7743'
  )
})
