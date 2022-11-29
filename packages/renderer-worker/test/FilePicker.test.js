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

const FilePicker = await import('../src/parts/FilePicker/FilePicker.js')
const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)

test('showDirectoryPicker - error', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(FilePicker.showDirectoryPicker()).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('showDirectoryPicker - error - canceled', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(async () => {
    throw new DOMException('The user aborted a request.', 'AbortError')
  })
  await expect(FilePicker.showDirectoryPicker()).rejects.toThrowError(
    new DOMException('The user aborted a request.', 'AbortError')
  )
})

test('showDirectoryPicker - error - not supported', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(async () => {
    throw new Error('window.showDirectoryPicker is not a function')
  })
  await expect(FilePicker.showDirectoryPicker()).rejects.toThrowError(
    new Error('showDirectoryPicker not supported on this browser')
  )
})

test('showFilePicker - error', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(FilePicker.showFilePicker()).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('showSaveFilePicker - error', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(FilePicker.showSaveFilePicker()).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('showSaveFilePicker - error - not supported', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(async () => {
    throw new Error('window.showSaveFilePicker is not a function')
  })
  await expect(FilePicker.showSaveFilePicker()).rejects.toThrowError(
    new Error('showSaveFilePicker not supported on this browser')
  )
})
