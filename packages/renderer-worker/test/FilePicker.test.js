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
  window.showDirectoryPicker.mockImplementation(async () => {
    throw new Error('The user aborted a request.')
  })
  await expect(FilePicker.showDirectoryPicker()).rejects.toThrowError(
    new Error('The user aborted a request.')
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
