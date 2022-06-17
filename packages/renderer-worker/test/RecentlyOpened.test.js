import { jest } from '@jest/globals'
import * as RecentlyOpened from '../src/parts/RecentlyOpened/RecentlyOpened.js'
import * as SharedProcess from '../src/parts/SharedProcess/SharedProcess.js'

test('addToRecentlyOpened - already in list', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'Platform.getRecentlyOpenedPath':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: '/test/recently-opened.json',
        })
        break
      case 'FileSystem.readFile':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: JSON.stringify([
            '/test/folder-1',
            '/test/folder-2',
            '/test/folder-3',
          ]),
        })
        break
      case 'FileSystem.writeFile':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: null,
        })
        break
      default:
        console.log({ message })
        throw new Error('unexpected message')
    }
  })
  await RecentlyOpened.addToRecentlyOpened('/test/folder-3')
  expect(SharedProcess.state.send).toHaveBeenCalledTimes(4)
  expect(SharedProcess.state.send).toHaveBeenNthCalledWith(4, {
    id: expect.any(Number),
    jsonrpc: '2.0',
    method: 'FileSystem.writeFile',
    params: [
      '/test/recently-opened.json',
      `[
  "/test/folder-3",
  "/test/folder-1",
  "/test/folder-2"
]
`,
    ],
  })
})

test('addToRecentlyOpened - already at front of list', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'Platform.getRecentlyOpenedPath':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: '/test/recently-opened.json',
        })
        break
      case 'FileSystem.readFile':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: JSON.stringify([
            '/test/folder-3',
            '/test/folder-1',
            '/test/folder-2',
          ]),
        })
        break
      case 'FileSystem.writeFile':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: null,
        })
        break
      default:
        console.log({ message })
        throw new Error('unexpected message')
    }
  })
  await RecentlyOpened.addToRecentlyOpened('/test/folder-3')
  // TODO not necessary to write again, because it is already at front of list
  expect(SharedProcess.state.send).toHaveBeenCalledTimes(4)
  expect(SharedProcess.state.send).toHaveBeenNthCalledWith(4, {
    id: expect.any(Number),
    jsonrpc: '2.0',
    method: 'FileSystem.writeFile',
    params: [
      '/test/recently-opened.json',
      `[
  "/test/folder-3",
  "/test/folder-1",
  "/test/folder-2"
]
`,
    ],
  })
})

test('addToRecentlyOpened - error - recently opened path is of type array', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'Platform.getRecentlyOpenedPath':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: [],
        })
        break
      case 'FileSystem.writeFile':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: null,
        })
        break
      default:
        console.log({ message })
        throw new Error('unexpected message')
    }
  })
  const spy = jest.spyOn(console, 'warn').mockImplementation(() => {})
  await expect(
    RecentlyOpened.addToRecentlyOpened('/test/folder-3')
  ).rejects.toThrowError(new Error(`expected value to be of type string`))
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(
    new Error(
      `Failed to read recently opened: expected value to be of type string`
    )
  )
})

test('addToRecentlyOpened - error - invalid json when reading recently opened', async () => {
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'Platform.getRecentlyOpenedPath':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: '/test/recently-opened.json',
        })
        break
      case 'FileSystem.readFile':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result:
            JSON.stringify([
              '/test/folder-1',
              '/test/folder-2',
              '/test/folder-3',
            ]) + '##',
        })
        break
      case 'FileSystem.writeFile':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: null,
        })
        break
      default:
        console.log({ message })
        throw new Error('unexpected message')
    }
  })
  await RecentlyOpened.addToRecentlyOpened('/test/folder-3')

  expect(SharedProcess.state.send).toHaveBeenCalledTimes(4)
  expect(SharedProcess.state.send).toHaveBeenNthCalledWith(4, {
    id: expect.any(Number),
    jsonrpc: '2.0',
    method: 'FileSystem.writeFile',
    params: [
      '/test/recently-opened.json',
      `[
  "/test/folder-3"
]
`,
    ],
  })
})
