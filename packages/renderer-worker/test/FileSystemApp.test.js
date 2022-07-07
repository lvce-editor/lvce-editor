import { jest } from '@jest/globals'

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
jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const FileSystemApp = await import('../src/parts/FileSystem/FileSystemApp.js')
const SharedProcess = await import(
  '../src/parts/SharedProcess/SharedProcess.js'
)

test.skip('readFile - settings', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'Platform.getUserSettingsPath':
        return '~/.config/app/settings.json'
      case 'FileSystem.readFile':
        return '{}'
      default:
        throw new Error('unexpected message')
    }
  })
  expect(await FileSystemApp.readFile('app://', 'app://settings.json')).toBe(
    '{}'
  )
})

test.skip('readFile - settings - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'Platform.getUserSettingsPath':
        throw new TypeError('x is not a function')
      case 101:
        return '{}'
      default:
        throw new Error('unexpected message')
    }
  })

  await expect(
    FileSystemApp.readFile('app://', 'app://settings.json')
  ).rejects.toThrowError(new TypeError('x is not a function'))
})

test('rename - error', async () => {
  await expect(
    FileSystemApp.rename(
      'app://',
      'app://settings.json',
      'app://new-settings.json'
    )
  ).rejects.toThrowError(new Error('not allowed'))
})

test('remove - error', async () => {
  await expect(
    FileSystemApp.remove('app://', 'app://settings.json')
  ).rejects.toThrowError(new Error('not allowed'))
})

test('mkdir - error', async () => {
  await expect(
    FileSystemApp.remove('app://', 'app://my-folder')
  ).rejects.toThrowError(new Error('not allowed'))
})

// TODO test writeFile and writeFile errors

test.skip('writeFile - settings - error parent folder does not exist', async () => {
  let i = 0
  SharedProcess.state.send = jest.fn((message) => {
    switch (message.method) {
      case 'Platform.getUserSettingsPath':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: '~/.config/app/settings.json',
        })
        break
      case 'FileSystem.mkdir':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: null,
        })
        break
      case 'FileSystem.writeFile':
        if (i++ === 0) {
          SharedProcess.state.receive({
            id: message.id,
            jsonrpc: '2.0',
            error: {
              message: `Failed to write to file "/test/app-name/settings.json": ENOENT: no such file or directory, open '/test/app-name/settings.json'`,
            },
          })
        } else {
          SharedProcess.state.receive({
            id: message.id,
            jsonrpc: '2.0',
            result: null,
          })
        }
        break
      case 'FileSystem.getPathSeparator':
        SharedProcess.state.receive({
          id: message.id,
          jsonrpc: '2.0',
          result: '/',
        })
        break
      default:
        throw new Error('unexpected message')
    }
  })
  await FileSystemApp.writeFile('app://', 'app://settings.json', '')
  expect(SharedProcess.state.send).toHaveBeenCalledTimes(4)
  expect(SharedProcess.state.send).toHaveBeenNthCalledWith(1, {
    id: expect.any(Number),
    jsonrpc: '2.0',
    method: 'Platform.getUserSettingsPath',
    params: [],
  })

  expect(SharedProcess.state.send).toHaveBeenNthCalledWith(2, {
    id: expect.any(Number),
    jsonrpc: '2.0',
    method: 'FileSystem.writeFile',
    params: ['~/.config/app/settings.json', ''],
  })
  // expect(SharedProcess.state.send).toHaveBeenNthCalledWith(3, {
  //   id: expect.any(Number),
  //   jsonrpc: '2.0',
  //   method: 112,
  //   params: [],
  // })
  // expect(SharedProcess.state.send).toHaveBeenNthCalledWith(4, {
  //   id: expect.any(Number),
  //   jsonrpc: '2.0',
  //   method: 'FileSystem.mkdir',
  //   params: ['~/.config/app'],
  // })

  // expect(SharedProcess.state.send).toHaveBeenNthCalledWith(5, {
  //   id: expect.any(Number),
  //   jsonrpc: '2.0',
  //   method: 102,
  //   params: ['~/.config/app/settings.json', ''],
  // })
})
