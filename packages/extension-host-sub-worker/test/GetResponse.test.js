import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({
  execute: jest.fn(() => {
    throw new Error('not implemented')
  }),
  invoke: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

jest.unstable_mockModule('../src/parts/PrettyError/PrettyError.js', () => ({
  prepare: jest.fn(() => {
    throw new Error('not implemented')
  }),
  print: jest.fn(() => {}),
}))

jest.unstable_mockModule('node:fs', () => ({
  readFileSync: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

jest.unstable_mockModule('../src/parts/Logger/Logger', () => ({
  error: jest.fn(() => {}),
}))

const GetResponse = await import('../src/parts/GetResponse/GetResponse.js')
const Command = await import('../src/parts/Command/Command.js')
const PrettyError = await import('../src/parts/PrettyError/PrettyError.js')

test('getResponse - error', async () => {
  // @ts-ignore
  Command.invoke.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  // @ts-ignore
  PrettyError.prepare.mockImplementation(() => {
    return {
      message: 'x is not a function',
      codeFrame: `
  57 | const getFolders = (files) => {
  58 | Command.invoke.mockImplementation(() => {
> 59 |   throw new TypeError('x is not a function')
     |         ^
`,
      stack: ``,
    }
  })

  expect(
    await GetResponse.getResponse({
      jsonrpc: '2.0',
      method: 'Test.test',
      params: [],
      id: 1,
    })
  ).toEqual({
    error: {
      code: -32001,
      message: 'x is not a function',
      data: {
        codeFrame: `
  57 | const getFolders = (files) => {
  58 | Command.invoke.mockImplementation(() => {
> 59 |   throw new TypeError('x is not a function')
     |         ^
`,
        stack: ``,
      },
    },
    id: 1,
    jsonrpc: '2.0',
  })
})
