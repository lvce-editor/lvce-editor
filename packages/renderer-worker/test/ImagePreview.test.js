import { jest } from '@jest/globals'
import * as FileSystem from '../src/parts/FileSystem/FileSystem.js'
import * as ImagePreview from '../src/parts/ImagePreview/ImagePreview.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'

beforeEach(() => {
  ImagePreview.state.uri = ''
})

test('show', async () => {
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
  await ImagePreview.show('/tmp/sample-image.png', 10, 20)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    3028,
    'ImagePreview',
    // TODO should be single slash
    '/remote//tmp/sample-image.png',
    -12,
    -160,
  ])
})

test('show - multiple times and out of order promises', async () => {
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
  FileSystem.state.fileSystems['test'] = {
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
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(1)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    3028,
    'ImagePreview',
    '/image-2.png',
    -12,
    -160,
  ])
})

test('show - error', async () => {
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
  FileSystem.state.fileSystems['test'] = {
    async getBlobUrl(protocol, uri) {
      throw new Error(
        'Error: Failed to request json from "https://api.github.com/repos/microsoft/vscode-docs/contents/blogs/2018/05/07/vsls.json.png": API rate limit exceeded for 127.0.0.0. (But here\'s the good news: Authenticated requests get a higher rate limit. Check out the documentation for more details.)'
      )
    },
  }
  await ImagePreview.show('test:///image-1.png', 10, 20)
  expect(RendererProcess.state.send).toHaveBeenCalledTimes(1)
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    3028,
    'ImagePreview',
    'Image could not be loaded',
    -12,
    -160,
  ])
})

test('hide', async () => {
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
  await ImagePreview.show('/tmp/sample-image.png')
  await ImagePreview.hide()
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
    3026,
    'ImagePreview',
  ])
})
