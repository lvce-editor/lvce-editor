import { jest } from '@jest/globals'
import * as FileSystem from '../src/parts/FileSystem/FileSystem.js'

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

const ImagePreview = await import('../src/parts/ImagePreview/ImagePreview.js')

beforeEach(() => {
  ImagePreview.state.uri = ''
})

test('show', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ImagePreview.show('/tmp/sample-image.png', 10, 20)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    3028,
    'ImagePreview',
    // TODO should be single slash
    '/remote//tmp/sample-image.png',
    -12,
    -160
  )
})

test.skip('show - multiple times and out of order promises', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  FileSystem.state.fileSystems.test = {
    async getBlobUrl(protocol, uri) {
      if (uri === 'test:///image-1.png') {
        await new Promise((resolve) => {
          setTimeout(resolve, 0)
        })
        return '/image-1.png'
      }
      if (uri === 'test:///tmp/image-2.png') {
        return '/image-2.png'
      }
    },
  }
  const promise1 = ImagePreview.show('test:///image-1.png', 10, 20)
  const promise2 = ImagePreview.show('test:///tmp/image-2.png', 10, 20)
  await Promise.all([promise1, promise2])
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    3028,
    'ImagePreview',
    '/image-2.png',
    -12,
    -160
  )
})

test.skip('show - error', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  FileSystem.state.fileSystems.test = {
    async getBlobUrl(protocol, uri) {
      throw new Error(
        'Error: Failed to request json from "https://api.github.com/repos/microsoft/vscode-docs/contents/blogs/2018/05/07/vsls.json.png": API rate limit exceeded for 127.0.0.0. (But here\'s the good news: Authenticated requests get a higher rate limit. Check out the documentation for more details.)'
      )
    },
  }
  await ImagePreview.show('test:///image-1.png', 10, 20)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    3028,
    'ImagePreview',
    'Image could not be loaded',
    -12,
    -160
  )
})

test('hide', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ImagePreview.show('/tmp/sample-image.png')
  await ImagePreview.hide()
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'Viewlet.dispose',
    'ImagePreview'
  )
})
