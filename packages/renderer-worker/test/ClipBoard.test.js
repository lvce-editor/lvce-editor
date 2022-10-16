import { jest } from '@jest/globals'

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

const SharedProcess = await import(
  '../src/parts/SharedProcess/SharedProcess.js'
)
const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)

const ClipBoard = await import('../src/parts/ClipBoard/ClipBoard.js')

test('readText', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    return 'abc'
  })
  expect(await ClipBoard.readText()).toBe('abc')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('ClipBoard.readText')
})

test('readText - clipboard not available', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    throw new TypeError('navigator.clipboard.readText is not a function')
  })
  await expect(ClipBoard.readText()).rejects.toThrowError(
    new Error(
      'Failed to read text from clipboard: The Clipboard Api is not available in Firefox'
    )
  )
})

test('readText - clipboard blocked', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    throw new Error('Read permission denied.')
  })
  await expect(ClipBoard.readText()).rejects.toThrowError(
    new Error(
      'Failed to read text from clipboard: The Browser disallowed reading from clipboard'
    )
  )
})

test('readText - other error', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(ClipBoard.readText()).rejects.toThrowError(
    new Error(
      'Failed to read text from clipboard: TypeError: x is not a function'
    )
  )
})

test('writeText', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ClipBoard.writeText('abc')
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith(
    'ClipBoard.writeText',
    'abc'
  )
})

test('writeText - error', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    throw new Error('not allowed')
  })
  await expect(ClipBoard.writeText('abc')).rejects.toThrowError(
    new Error('Failed to write text to clipboard: Error: not allowed')
  )
})

// TODO test readNativeFiles error
test('readNativeFiles - not supported', async () => {
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

test('readNativeFiles - copied gnome files', async () => {
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

test('readNativeFiles - cut gnome files', async () => {
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

test('writeNativeFiles', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...parameters) => {
    return null
  })
  await ClipBoard.writeNativeFiles('copy', ['/test/my-folder'])
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'ClipBoard.writeFiles',
    'copy',
    ['/test/my-folder']
  )
})

test('writeImage - error', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(
    ClipBoard.writeImage({
      type: 'image/avif',
    })
  ).rejects.toThrowError(
    new Error(
      'Failed to write image to clipboard: TypeError: x is not a function'
    )
  )
})

test('writeImage - error - format not supported', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(async () => {
    throw new Error('Type image/avif not supported on write.')
  })
  await expect(
    ClipBoard.writeImage({
      type: 'image/avif',
    })
  ).rejects.toThrowError(
    new Error(
      'Failed to write image to clipboard: Error: Type image/avif not supported on write.'
    )
  )
})

test('writeImage', async () => {
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

test('execCopy - error', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(ClipBoard.execCopy()).rejects.toThrowError(
    new Error('Failed to copy selected text: TypeError: x is not a function')
  )
})

test('execCopy', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await ClipBoard.execCopy()
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('ClipBoard.execCopy')
})
