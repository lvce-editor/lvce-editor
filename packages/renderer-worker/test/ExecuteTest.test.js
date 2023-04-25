import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(() => {}),
  }
})
jest.unstable_mockModule('../src/parts/ErrorHandling/ErrorHandling.js', () => {
  return {
    handleError: jest.fn(() => {}),
  }
})

const ExecuteTest = await import('../src/parts/ExecuteTest/ExecuteTest.js')
const ErrorHandling = await import('../src/parts/ErrorHandling/ErrorHandling.js')

test('executeTest - error - SyntaxError in TestFramework', async () => {
  const fn = () => {
    const error = new Error()
    error.message = `Failed to load command TestFrameWork.showOverlay: VError: failed to load module 24: SyntaxError: Unexpected token ','`
    error.stack = `  at http://localhost/packages/renderer-process/src/parts/TestFrameWork/ElementActions.js:17:47`
    throw error
  }
  await ExecuteTest.executeTest('test', fn)
  expect(ErrorHandling.handleError).toHaveBeenCalledTimes(1)
  expect(ErrorHandling.handleError).toHaveBeenCalledWith(
    new Error(`Failed to load command TestFrameWork.showOverlay: VError: failed to load module 24: SyntaxError: Unexpected token ','`)
  )
})

test('executeTest - error', async () => {
  const fn = () => {
    throw new TypeError('x is not a function')
  }
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
  await ExecuteTest.executeTest('test', fn)
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(new TypeError('x is not a function'))
})
