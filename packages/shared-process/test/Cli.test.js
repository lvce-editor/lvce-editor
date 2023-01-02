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

jest.unstable_mockModule('../src/parts/Process/Process.js', () => ({
  setExitCode: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/Logger/Logger.js', () => ({
  error: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

const CliInstall = await import('../src/parts/CliInstall/CliInstall.js')
const CliList = await import('../src/parts/CliList/CliList.js')
const Logger = await import('../src/parts/Logger/Logger.js')
const Process = await import('../src/parts/Process/Process.js')
const Cli = await import('../src/parts/Cli/Cli.js')

test('handleCliArgs - install - error', async () => {
  // @ts-ignore
  CliInstall.handleCliArgs.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await Cli.handleCliArgs(['install'])
  expect(Logger.error).toHaveBeenCalledTimes(1)
  expect(Logger.error).toHaveBeenCalledWith(new TypeError('x is not a function'))
  expect(Process.setExitCode).toHaveBeenCalledTimes(1)
  expect(Process.setExitCode).toHaveBeenCalledWith(1)
})

test('handleCliArgs - install', async () => {
  // @ts-ignore
  CliInstall.handleCliArgs.mockImplementation(() => {})
  await Cli.handleCliArgs(['install'])
  expect(CliInstall.handleCliArgs).toHaveBeenCalledTimes(1)
  expect(CliInstall.handleCliArgs).toHaveBeenCalledWith(['install'])
})

test('handleCliArgs - list', async () => {
  // @ts-ignore
  CliList.handleCliArgs.mockImplementation(() => {})
  await Cli.handleCliArgs(['list'])
  expect(CliList.handleCliArgs).toHaveBeenCalledTimes(1)
  expect(CliList.handleCliArgs).toHaveBeenCalledWith(['list'])
})
