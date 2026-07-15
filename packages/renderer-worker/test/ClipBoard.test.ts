import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const SharedProcess = await import('../src/parts/SharedProcess/SharedProcess.js')
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')

const ClipBoard = await import('../src/parts/ClipBoard/ClipBoard.js')

test.skip('readText', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    return 'abc'
  })
  expect(await ClipBoard.readText()).toBe('abc')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('ClipBoard.readText')
})

test.skip('readText - clipboard not available', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    throw new TypeError('navigator.clipboard.readText is not a function')
  })
  await expect(ClipBoard.readText()).rejects.toThrow(new Error('Failed to read text from clipboard: The Clipboard Api is not available in Firefox'))
})

test.skip('readText - clipboard blocked', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    throw new Error('Read permission denied.')
  })
  await expect(ClipBoard.readText()).rejects.toThrow(new Error('Failed to read text from clipboard: The Browser disallowed reading from clipboard'))
})

test.skip('readText - other error', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(ClipBoard.readText()).rejects.toThrow(new Error('Failed to read text from clipboard: TypeError: x is not a function'))
})

test.skip('writeText', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ClipBoard.writeText('abc')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('ClipBoard.writeText', 'abc')
})

test.skip('writeText - error', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    throw new Error('not allowed')
  })
  await expect(ClipBoard.writeText('abc')).rejects.toThrow(new Error('Failed to write text to clipboard: not allowed'))
})

// TODO test readNativeFiles error
test.skip('readNativeFiles - not supported', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    return {
      source: 'notSupported',
      type: 'none',
      files: [],
    }
  })
  expect(await ClipBoard.readNativeFiles()).toEqual({
    source: 'notSupported',
    type: 'none',
    files: [],
  })
})

test.skip('readNativeFiles - copied gnome files', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    return {
      source: 'gnomeCopiedFiles',
      type: 'copy',
      files: ['/test/some-file.txt'],
    }
  })
  expect(await ClipBoard.readNativeFiles()).toEqual({
    source: 'gnomeCopiedFiles',
    type: 'copy',
    files: ['/test/some-file.txt'],
  })
})

test.skip('readNativeFiles - cut gnome files', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    return {
      source: 'gnomeCopiedFiles',
      type: 'cut',
      files: ['/test/some-file.txt'],
    }
  })
  expect(await ClipBoard.readNativeFiles()).toEqual({
    source: 'gnomeCopiedFiles',
    type: 'cut',
    files: ['/test/some-file.txt'],
  })
})

test.skip('writeNativeFiles', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    return null
  })
  await ClipBoard.writeNativeFiles('copy', ['/test/my-folder'])
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith('ClipBoard.writeFiles', 'copy', ['/test/my-folder'])
})

test.skip('writeImage - error', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ClipBoard.writeImage({
      type: 'image/avif',
    }),
  ).rejects.toThrow(new Error('Failed to write image to clipboard: TypeError: x is not a function'))
})

test.skip('writeImage - error - format not supported', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(async () => {
    throw new Error('Type image/avif not supported on write.')
  })
  await expect(
    ClipBoard.writeImage({
      type: 'image/avif',
    }),
  ).rejects.toThrow(new Error('Failed to write image to clipboard: Type image/avif not supported on write.'))
})

test.skip('writeImage', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ClipBoard.writeImage({
    type: 'image/avif',
  })
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('ClipBoard.writeImage', {
    type: 'image/avif',
  })
})

test.skip('execCopy - error', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(ClipBoard.execCopy()).rejects.toThrow(new Error('Failed to copy selected text: TypeError: x is not a function'))
})

test.skip('execCopy', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ClipBoard.execCopy()
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('ClipBoard.execCopy')
})
