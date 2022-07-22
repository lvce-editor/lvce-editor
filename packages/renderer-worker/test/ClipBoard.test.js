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

const SharedProcess = await import(
  '../src/parts/SharedProcess/SharedProcess.js'
)

const ClipBoard = await import('../src/parts/ClipBoard/ClipBoard.js')

test('readText', async () => {
  globalThis.navigator = {
    // @ts-ignore
    clipboard: {
      // @ts-ignore
      readText() {
        return 'abc'
      },
    },
  }
  await expect(ClipBoard.readText()).resolves.toBe('abc')
})

test('readText - clipboard not available', async () => {
  globalThis.navigator = {
    // @ts-ignore
    clipboard: {},
  }
  await expect(ClipBoard.readText()).rejects.toThrowError(
    new Error(
      `Failed to read text: The Clipboard Api is not available in Firefox`
    )
  )
})

test('readText - clipboard blocked', async () => {
  globalThis.navigator = {
    // @ts-ignore
    clipboard: {
      readText() {
        throw new Error('Read permission denied.')
      },
    },
  }
  await expect(ClipBoard.readText()).rejects.toThrowError(
    new Error(
      `Failed to paste text: The Browser disallowed reading from clipboard`
    )
  )
})

test('readText - other error', async () => {
  globalThis.navigator = {
    // @ts-ignore
    clipboard: {
      readText() {
        throw new TypeError('x is not a function')
      },
    },
  }
  await expect(ClipBoard.readText()).rejects.toThrowError(
    new Error(
      'Failed to read text from clipboard: TypeError: x is not a function'
    )
  )
})

test('writeText', async () => {
  globalThis.navigator = {
    // @ts-ignore
    clipboard: {
      // @ts-ignore
      writeText: jest.fn(),
    },
  }
  await ClipBoard.writeText('abc')
  // @ts-ignore
  expect(globalThis.navigator.clipboard.writeText).toHaveBeenCalledWith('abc')
})

test('writeText - error', async () => {
  globalThis.navigator = {
    // @ts-ignore
    clipboard: {
      writeText() {
        throw new Error('not allowed')
      },
    },
  }
  await expect(ClipBoard.writeText('abc')).rejects.toThrowError(
    new Error('Failed to write text to clipboard: Error: not allowed')
  )
})

// TODO test readNativeFiles error
test('readNativeFiles - not supported', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ClipBoard.readFiles':
        return {
          source: 'notSupported',
          type: 'none',
          files: [],
        }
      default:
        throw new Error('unexpected message')
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
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ClipBoard.readFiles':
        return {
          source: 'gnomeCopiedFiles',
          type: 'copy',
          files: ['/test/some-file.txt'],
        }
      default:
        throw new Error('unexpected message')
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
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ClipBoard.readFiles':
        return {
          source: 'gnomeCopiedFiles',
          type: 'cut',
          files: ['/test/some-file.txt'],
        }
      default:
        throw new Error('unexpected message')
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
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'ClipBoard.writeFiles':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  await ClipBoard.writeNativeFiles('copy', ['/test/my-folder'])
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(1)
  expect(SharedProcess.invoke).toHaveBeenCalledWith(
    'ClipBoard.writeFiles',
    'copy',
    ['/test/my-folder']
  )
})
