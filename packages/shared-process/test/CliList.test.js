import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/ExtensionList/ExtensionList.js', () => ({
  list: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

jest.unstable_mockModule('../src/parts/Logger/Logger.js', () => ({
  error: jest.fn(() => {}),
  info: jest.fn(() => {}),
}))

jest.unstable_mockModule('../src/parts/Process/Process.js', () => ({
  setExitCode: jest.fn(() => {}),
}))

const ExtensionList = await import('../src/parts/ExtensionList/ExtensionList.js')
const CliList = await import('../src/parts/CliList/CliList.js')
const Process = await import('../src/parts/Process/Process.js')
const Logger = await import('../src/parts/Logger/Logger.js')

test('handleCliArgs - error', async () => {
  // @ts-ignore
  ExtensionList.list.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(CliList.handleCliArgs([])).rejects.toThrowError(new TypeError('x is not a function'))
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

  await CliList.handleCliArgs([])
  expect(Logger.info).toHaveBeenCalledTimes(1)
  expect(Logger.info).toHaveBeenCalledWith(`extension-1: 0.0.1`)
  expect(Logger.error).not.toHaveBeenCalled()
})
