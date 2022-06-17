import { jest } from '@jest/globals'
import * as FileSystem from '../src/parts/FileSystem/FileSystem.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'

// TODO duplicate test code with FileSystemDisk.test.js

test('readFile', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.readFile':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: 'sample text',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  expect(await FileSystem.readFile('/tmp/some-file.txt')).toEqual('sample text')
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    id: expect.any(Number),
    jsonrpc: '2.0',
    method: 'FileSystem.readFile',
    params: ['/tmp/some-file.txt'],
  })
})

test('readFile - error', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.readFile':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          error: {
            message: 'TypeError: x is not a function',
          },
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(FileSystem.readFile('/tmp/some-file.txt')).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('removeFile', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.remove':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: null,
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await FileSystem.remove('/tmp/some-file.txt')
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    id: expect.any(Number),
    jsonrpc: '2.0',
    method: 'FileSystem.remove',
    params: ['/tmp/some-file.txt'],
  })
})

test('removeFile - error', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.remove':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          error: {
            message: 'TypeError: x is not a function',
          },
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(FileSystem.remove('/tmp/some-file.txt')).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('rename', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.rename':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: undefined,
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await FileSystem.rename('/tmp/some-file.txt', '/tmp/renamed.txt')
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    id: expect.any(Number),
    jsonrpc: '2.0',
    method: 'FileSystem.rename',
    params: ['/tmp/some-file.txt', '/tmp/renamed.txt'],
  })
})

test('rename - error', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.rename':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          error: {
            message: 'TypeError: x is not a function',
          },
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(
    FileSystem.rename('/tmp/some-file.txt', '/tmp/renamed.txt')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('mkdir', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.mkdir':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: undefined,
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await FileSystem.mkdir('/tmp/some-dir')
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    id: expect.any(Number),
    jsonrpc: '2.0',
    method: 'FileSystem.mkdir',
    params: ['/tmp/some-dir'],
  })
})

test('mkdir - error', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.mkdir':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          error: {
            message: 'TypeError: x is not a function',
          },
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(FileSystem.mkdir('/tmp/some-dir')).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('writeFile', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.writeFile':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: null,
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await FileSystem.writeFile('/tmp/some-file.txt', 'sample text')
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    id: expect.any(Number),
    jsonrpc: '2.0',
    method: 'FileSystem.writeFile',
    params: ['/tmp/some-file.txt', 'sample text'],
  })
})

test('writeFile - error', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.writeFile':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          error: {
            message: 'TypeError: x is not a function',
          },
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(
    FileSystem.writeFile('/tmp/some-file.txt', 'sample text')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('readDirWithFileTypes', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.readDirWithFileTypes':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: [
            {
              name: 'file 1',
              type: 'file',
            },
            {
              name: 'file 2',
              type: 'file',
            },
            {
              name: 'file 3',
              type: 'file',
            },
          ],
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  expect(await FileSystem.readDirWithFileTypes('/tmp/some-dir')).toEqual([
    {
      name: 'file 1',
      type: 'file',
    },
    {
      name: 'file 2',
      type: 'file',
    },
    {
      name: 'file 3',
      type: 'file',
    },
  ])
  expect(SharedProcess.state.send).toHaveBeenCalledWith({
    id: expect.any(Number),
    jsonrpc: '2.0',
    method: 'FileSystem.readDirWithFileTypes',
    params: ['/tmp/some-dir'],
  })
})

test('readDirWithFileTypes - error', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'FileSystem.readDirWithFileTypes':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          error: {
            message: 'TypeError: x is not a function',
          },
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(
    FileSystem.readDirWithFileTypes('/tmp/some-dir')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test.skip('watch', async () => {
  // await FileSystem.watch('/tmp/some-dir')
  // writeFile
  // FileSystem.unwatchAll()
})
