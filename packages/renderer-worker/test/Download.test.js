/**
 * @jest-environment jsdom
 */
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

jest.unstable_mockModule('../src/parts/Url/Url.js', () => {
  return {
    createObjectUrl: jest.fn(() => {
      throw new Error('not implemented')
    }),
    revokeObjectUrl: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const Download = await import('../src/parts/Download/Download.js')
const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)
const Url = await import('../src/parts/Url/Url.js')

test('downloadFile - error', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(
    Download.downloadFile('test.txt', 'test://test-url')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('downloadFile - error - fileName is not of type string', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await expect(Download.downloadFile(123, 456)).rejects.toThrowError(
    'expected value to be of type string'
  )
})

test('downloadFile', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Download.downloadFile('test.txt', 'test://test-url')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Download.downloadFile',
    'test.txt',
    'test://test-url'
  )
})

test('downloadJson - error with download', async () => {
  // @ts-ignore
  Url.createObjectUrl.mockImplementation(() => 'test://test-session.json')
  // @ts-ignore
  Url.revokeObjectUrl.mockImplementation(() => {})
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })

  await expect(Download.downloadJson([], 'test.json')).rejects.toThrowError(
    new Error('Failed to download test.json: TypeError: x is not a function')
  )
  expect(Url.revokeObjectUrl).toHaveBeenCalledTimes(1)
  expect(Url.revokeObjectUrl).toHaveBeenCalledWith('test://test-session.json')
})

test('downloadJson', async () => {
  // @ts-ignore
  Url.createObjectUrl.mockImplementation(() => 'test://test-session.json')
  // @ts-ignore
  Url.revokeObjectUrl.mockImplementation(() => {})
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Download.downloadJson([], 'test.json')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Download.downloadFile',
    'test.json',
    'test://test-session.json'
  )
  expect(Url.revokeObjectUrl).toHaveBeenCalledTimes(1)
  expect(Url.revokeObjectUrl).toHaveBeenCalledWith('test://test-session.json')
})
