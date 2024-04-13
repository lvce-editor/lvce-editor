import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetModules()
})

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    productNameLong: 'Test',
    version: '0.0.0-dev',
  }
})

jest.unstable_mockModule('../src/parts/Exit/Exit.js', () => {
  return {
    exit: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/Logger/Logger.js', () => {
  return {
    info: jest.fn(),
  }
})

const CliVersion = await import('../src/parts/CliVersion/CliVersion.js')
const Logger = await import('../src/parts/Logger/Logger.js')
const Exit = await import('../src/parts/Exit/Exit.js')

test('handleCliArgs', async () => {
  await CliVersion.handleCliArgs({})
  expect(Logger.info).toHaveBeenCalledTimes(1)
  expect(Logger.info).toHaveBeenCalledWith('0.0.0-dev')
  expect(Exit.exit).toHaveBeenCalledTimes(1)
})
