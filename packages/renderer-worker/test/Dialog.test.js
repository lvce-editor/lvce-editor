import { jest } from '@jest/globals'
import * as Platform from '../src/parts/Platform/Platform.js'

beforeEach(() => {
  Dialog.state.dialog = undefined
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
jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)
const SharedProcess = await import(
  '../src/parts/SharedProcess/SharedProcess.js'
)
const Dialog = await import('../src/parts/Dialog/Dialog.js')

// TODO would need to test different platforms

test.skip('openFolder', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
    return ['/tmp/some-folder']
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Dialog.openFolder()
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith({
    jsonrpc: '2.0',
    id: expect.any(Number),
    method: 8307,
    params: [],
  })
})

test('showAbout - electron', async () => {
  // TODO mock platform
  Platform.state.getPlatform = () => {
    return 'electron'
  }
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
    return null
  })
  await Dialog.showAbout()
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('Electron.about')
})

// TODO what if showErrorMessage results in error?
// Then showing error message would result in endless loop
// be careful and add test

test('showMessage - web', async () => {
  Platform.state.getPlatform = () => {
    return 'web'
  }
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Dialog.showMessage(
    {
      message: 'Error: Oops',
      codeFrame: '',
      stack: '',
    },
    []
  )
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Dialog.showErrorDialogWithOptions',
    {
      message: 'Error: Oops',
      codeFrame: '',
      stack: '',
    },
    []
  )
})

test('showMessage - electron', async () => {
  Platform.state.getPlatform = () => {
    return 'electron'
  }
  // @ts-ignore
  SharedProcess.invoke.mockImplementation(() => {
    return null
  })
  await Dialog.showMessage(
    {
      message: 'Error: Oops',
      codeFrame: '',
      stack: '',
    },
    []
  )
  expect(Dialog.state.dialog).toEqual({
    message: { codeFrame: '', message: 'Error: Oops', stack: '' },
    options: [],
  })
})

test('close - web', async () => {
  Platform.state.getPlatform = () => {
    return 'web'
  }
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Dialog.showMessage(
    {
      message: 'Error: Oops',
      codeFrame: '',
      stack: '',
    },
    []
  )
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Dialog.close()
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(7836)
})
