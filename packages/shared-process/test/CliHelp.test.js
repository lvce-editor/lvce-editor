import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetModules()
})

jest.unstable_mockModule('../src/parts/Exit/Exit', () => {
  return {
    exit: jest.fn(),
  }
})
jest.unstable_mockModule('../src/parts/Logger/Logger', () => {
  return {
    info: jest.fn(),
  }
})

const CliHelp = await import('../src/parts/CliHelp/CliHelp.js')
const Logger = await import('../src/parts/Logger/Logger.js')
const Exit = await import('../src/parts/Exit/Exit.js')

test('handleCliArgs', async () => {
  await CliHelp.handleCliArgs({})
  expect(Logger.info).toHaveBeenCalledTimes(1)
  expect(Logger.info).toHaveBeenCalledWith(`lvce-oss v0.0.0-dev

Usage:
  lvce-oss [path]
`)
})
