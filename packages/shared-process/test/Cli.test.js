import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/CliList/CliList.js', () => ({
  handleCliArgs: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))
jest.unstable_mockModule('../src/parts/CliInstall/CliInstall.js', () => ({
  handleCliArgs: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

const CliInstall = await import('../src/parts/CliInstall/CliInstall.js')
const CliList = await import('../src/parts/CliList/CliList.js')
const Cli = await import('../src/parts/Cli/Cli.js')

test('handleCliArgs - install - error', async () => {
  // @ts-ignore
  CliInstall.handleCliArgs.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  const console = {
    info: jest.fn(),
    error: jest.fn(),
  }
  const process = {
    _exitCode: 0,
    get exitCode() {
      return this._exitCode
    },
    set exitCode(value) {
      this._exitCode = value
    },
  }
  await Cli.handleCliArgs(['install'], console, process)
  expect(console.error).toHaveBeenCalledTimes(1)
  expect(console.error).toHaveBeenCalledWith(
    new TypeError('x is not a function')
  )
  expect(process.exitCode).toBe(1)
})

test('handleCliArgs - install', async () => {
  // @ts-ignore
  CliInstall.handleCliArgs.mockImplementation(() => {})
  const console = {
    info: jest.fn(),
    error: jest.fn(),
  }
  const process = {
    exit: jest.fn(),
  }
  await Cli.handleCliArgs(['install'], console, process)
  expect(CliInstall.handleCliArgs).toHaveBeenCalledTimes(1)
  expect(CliInstall.handleCliArgs).toHaveBeenCalledWith(
    ['install'],
    console,
    process
  )
})

test('handleCliArgs - list', async () => {
  // @ts-ignore
  CliList.handleCliArgs.mockImplementation(() => {})
  const console = {
    info: jest.fn(),
    error: jest.fn(),
  }
  const process = {
    exit: jest.fn(),
  }
  await Cli.handleCliArgs(['list'], console, process)
  expect(CliList.handleCliArgs).toHaveBeenCalledTimes(1)
  expect(CliList.handleCliArgs).toHaveBeenCalledWith(['list'], console, process)
})
