import { jest } from '@jest/globals'
import * as ErrorCodes from '../src/parts/ErrorCodes/ErrorCodes.js'
import * as JsonRpcVersion from '../src/parts/JsonRpcVersion/JsonRpcVersion.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/PrettyError/PrettyError.js', () => ({
  prepare: jest.fn(() => {
    throw new Error('not implemented')
  }),
  print: jest.fn(() => {}),
}))

jest.unstable_mockModule('../src/parts/Logger/Logger.js', () => ({
  error: jest.fn(() => {}),
}))

jest.unstable_mockModule('node:fs', () => ({
  readFileSync: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

const GetResponse = await import('../src/parts/GetResponse/GetResponse.js')
const PrettyError = await import('../src/parts/PrettyError/PrettyError.js')
const Logger = await import('../src/parts/Logger/Logger.js')

class NodeError extends Error {
  constructor(code, message = code) {
    super(code)
    this.code = code
  }
}

test('getResponse - error - ENOENT', async () => {
  const ipc = {}
  const execute = () => {
    throw new NodeError(ErrorCodes.ENOENT)
  }
  // @ts-ignore
  PrettyError.prepare.mockImplementation((error) => {
    return {
      message: error.message,
      code: error.code,
    }
  })
  expect(
    await GetResponse.getResponse(
      {
        jsonrpc: JsonRpcVersion.Two,
        method: 'Test.test',
        params: [],
        id: 1,
      },
      ipc,
      execute,
    ),
  ).toEqual({
    error: {
      code: -32001,
      message: 'Error: ENOENT',
      data: {
        code: ErrorCodes.ENOENT,
      },
    },
    id: 1,
    jsonrpc: JsonRpcVersion.Two,
  })
})

test('getResponse - error - search error', async () => {
  const ipc = {}
  const execute = () => {
    throw new Error('files is not iterable')
  }
  // @ts-ignore
  PrettyError.prepare.mockImplementation(() => {
    return {
      message: 'files is not iterable',
      codeFrame: `  57 | const getFolders = (files) => {
  58 |   const folders = []
> 59 |   for (const file of files) {
     |                      ^
  60 |     const dir = dirname(file)
  61 |     if (!folders.includes(dir)) {
  62 |       folders.push(dir)`,
      stack: `    at getFolders (/test/packages/shared-process/src/parts/SearchFile/SearchFile.js:59:22)
    at getLastModified (/test/packages/shared-process/src/parts/SearchFile/SearchFile.js:69:19)
    at Object.searchFile [as SearchFile.searchFile] (/test/packages/shared-process/src/parts/SearchFile/SearchFile.js:80:26)
    at async Module.getResponse (/test/packages/shared-process/src/parts/GetResponse/GetResponse.js:11:9)
    at async WebSocket.handleMessage (/test/packages/shared-process/src/parts/Socket/Socket.js:32:22)`,
      type: 'TypeError',
    }
  })
  expect(
    await GetResponse.getResponse(
      {
        jsonrpc: JsonRpcVersion.Two,
        method: 'Test.test',
        params: [],
        id: 1,
      },
      ipc,
      execute,
    ),
  ).toEqual({
    error: {
      code: -32001,
      data: {
        codeFrame: `  57 | const getFolders = (files) => {
  58 |   const folders = []
> 59 |   for (const file of files) {
     |                      ^
  60 |     const dir = dirname(file)
  61 |     if (!folders.includes(dir)) {
  62 |       folders.push(dir)`,
        stack: `    at getFolders (/test/packages/shared-process/src/parts/SearchFile/SearchFile.js:59:22)
    at getLastModified (/test/packages/shared-process/src/parts/SearchFile/SearchFile.js:69:19)
    at Object.searchFile [as SearchFile.searchFile] (/test/packages/shared-process/src/parts/SearchFile/SearchFile.js:80:26)
    at async Module.getResponse (/test/packages/shared-process/src/parts/GetResponse/GetResponse.js:11:9)
    at async WebSocket.handleMessage (/test/packages/shared-process/src/parts/Socket/Socket.js:32:22)`,
        type: 'TypeError',
      },
      message: 'files is not iterable',
    },
    id: 1,
    jsonrpc: JsonRpcVersion.Two,
  })
  expect(Logger.error).toHaveBeenCalledTimes(1)
  expect(Logger.error).toHaveBeenCalledWith(`[shared-process] TypeError: files is not iterable

  57 | const getFolders = (files) => {
  58 |   const folders = []
> 59 |   for (const file of files) {
     |                      ^
  60 |     const dir = dirname(file)
  61 |     if (!folders.includes(dir)) {
  62 |       folders.push(dir)

    at getFolders (/test/packages/shared-process/src/parts/SearchFile/SearchFile.js:59:22)
    at getLastModified (/test/packages/shared-process/src/parts/SearchFile/SearchFile.js:69:19)
    at Object.searchFile [as SearchFile.searchFile] (/test/packages/shared-process/src/parts/SearchFile/SearchFile.js:80:26)
    at async Module.getResponse (/test/packages/shared-process/src/parts/GetResponse/GetResponse.js:11:9)
    at async WebSocket.handleMessage (/test/packages/shared-process/src/parts/Socket/Socket.js:32:22)
`)
})
