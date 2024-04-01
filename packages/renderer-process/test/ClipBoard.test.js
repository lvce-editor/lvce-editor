import { beforeEach, expect, jest, test, beforeAll } from '@jest/globals'

beforeAll(() => {
  // @ts-ignore
  globalThis.ClipboardItem = class {
    constructor(options) {
      this.options = options
    }
  }
})

beforeEach(() => {
  jest.resetAllMocks()
})

const ClipBoard = await import('../src/parts/ClipBoard/ClipBoard.ts')

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
  await expect(ClipBoard.readText()).rejects.toThrow(new TypeError('navigator.clipboard.readText is not a function'))
})

test('readText - clipboard blocked', async () => {
  globalThis.navigator = {
    // @ts-ignore
    clipboard: {
      async readText() {
        throw new Error('Read permission denied.')
      },
    },
  }
  await expect(ClipBoard.readText()).rejects.toThrow(new Error('Read permission denied.'))
})

test('readText - other error', async () => {
  globalThis.navigator = {
    // @ts-ignore
    clipboard: {
      async readText() {
        throw new TypeError('x is not a function')
      },
    },
  }
  await expect(ClipBoard.readText()).rejects.toThrow(new TypeError('x is not a function'))
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
  await expect(ClipBoard.writeText('abc')).rejects.toThrow(new Error('not allowed'))
})

test('writeText - error - format not supported', async () => {
  globalThis.navigator = {
    // @ts-ignore
    clipboard: {
      async write() {
        throw new Error('Type image/avif not supported on write.')
      },
    },
  }

  await expect(
    ClipBoard.writeImage({
      type: 'image/avif',
    }),
  ).rejects.toThrow(new Error('Type image/avif not supported on write.'))
})

test('writeText', async () => {
  globalThis.navigator = {
    clipboard: {
      // @ts-ignore
      write: jest.fn(),
    },
  }
  const blob = {
    type: 'image/png',
  }
  await ClipBoard.writeImage(blob)
  // @ts-ignore
  expect(globalThis.navigator.clipboard.write).toHaveBeenCalledTimes(1)
  // @ts-ignore
  expect(globalThis.navigator.clipboard.write).toHaveBeenCalledWith([
    new ClipboardItem({
      // @ts-ignore
      'image/png': blob,
    }),
  ])
})

test('execCopy', async () => {
  globalThis.navigator = {
    clipboard: {
      // @ts-ignore
      writeText: jest.fn(),
    },
  }
  // @ts-ignore
  globalThis.getSelection = jest.fn(() => {
    return {
      toString() {
        return 'abc'
      },
    }
  })
  await ClipBoard.execCopy()
  // @ts-ignore
  expect(globalThis.navigator.clipboard.writeText).toHaveBeenCalledTimes(1)
  // @ts-ignore
  expect(globalThis.navigator.clipboard.writeText).toHaveBeenCalledWith('abc')
})
