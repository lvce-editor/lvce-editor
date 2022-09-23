import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ExtensionList/ExtensionList.js', () => ({
  list: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

const ExtensionList = await import(
  '../src/parts/ExtensionList/ExtensionList.js'
)
const CliList = await import('../src/parts/CliList/CliList.js')

test('handleCliArgs - error', async () => {
  // @ts-ignore
  ExtensionList.list.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  const stdout = {
    write: jest.fn(),
  }
  const stderr = {
    write: jest.fn(),
  }
  await expect(CliList.handleCliArgs([], stdout, stderr)).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('handleCliArgs', async () => {
  // @ts-ignore
  ExtensionList.list.mockImplementation(() => {
    return [
      {
        id: 'extension-1',
        version: '0.0.1',
      },
    ]
  })
  const console = {
    info: jest.fn(),
    error: jest.fn(),
  }
  await CliList.handleCliArgs([], console)
  expect(console.info).toHaveBeenCalledTimes(1)
  expect(console.info).toHaveBeenCalledWith(`[
  {
    \"id\": \"extension-1\",
    \"version\": \"0.0.1\"
  }
]
`)
  expect(console.error).not.toHaveBeenCalled()
})
