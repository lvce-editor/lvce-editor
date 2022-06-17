import { jest } from '@jest/globals'
import * as ClipBoard from '../src/parts/ClipBoard/ClipBoard.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'

test('readText', async () => {
  globalThis.navigator = {
    // @ts-ignore
    clipboard: {
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
  console.warn = jest.fn()
  await expect(ClipBoard.readText()).resolves.toBe(undefined)
  expect(console.warn).toHaveBeenCalledWith(
    'Failed to paste text: The Clipboard Api is not available in Firefox'
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
  console.warn = jest.fn()
  await expect(ClipBoard.readText()).resolves.toBe(undefined)
  expect(console.warn).toHaveBeenCalledWith(
    'Failed to paste text: The Browser disallowed reading from clipboard'
  )
})

test('readText - other error', async () => {
  globalThis.navigator = {
    // @ts-ignore
    clipboard: {
      readText() {
        throw new Error('test error')
      },
    },
  }
  console.warn = jest.fn()
  await expect(ClipBoard.readText()).resolves.toBe(undefined)
  expect(console.warn).toHaveBeenCalledWith(new Error('test error'))
})

test('writeText', async () => {
  globalThis.navigator = {
    // @ts-ignore
    clipboard: {
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
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  await ClipBoard.writeText('abc')
  expect(spy).toHaveBeenCalledWith(new Error('not allowed'))
})

// TODO test readNativeFiles error
test('readNativeFiles - not supported', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ClipBoard.readFiles':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: {
            source: 'notSupported',
            type: 'none',
            files: [],
          },
        })
        break
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
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ClipBoard.readFiles':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: {
            source: 'gnomeCopiedFiles',
            type: 'copy',
            files: ['/test/some-file.txt'],
          },
        })
        break
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
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ClipBoard.readFiles':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: {
            source: 'gnomeCopiedFiles',
            type: 'cut',
            files: ['/test/some-file.txt'],
          },
        })
        break
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
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'ClipBoard.writeFiles':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: null,
        })
        break
      default:
        console.log(message)
        throw new Error('unexpected message')
    }
  })
  await ClipBoard.writeNativeFiles('copy', ['/test/my-folder'])
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    id: expect.any(Number),
    jsonrpc: '2.0',
    method: 'ClipBoard.writeFiles',
    params: ['copy', ['/test/my-folder']],
  })
})
