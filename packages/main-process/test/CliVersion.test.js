import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetModules()
})

jest.unstable_mockModule('electron', () => {
  return {
    app: {
      exit() {},
    },
  }
})

jest.unstable_mockModule('../src/parts/Platform/Platform.cjs', () => {
  return {
    productNameLong: 'Test',
    version: '0.0.0-dev',
  }
})

const CliVersion = await import('../src/parts/CliVersion/CliVersion.js')

test.skip('handleCliArgs', async () => {
  const spy = jest.spyOn(console, 'info').mockImplementation()
  const mockVersions = {
    electron: '0.0.0-dev',
    chrome: '0.0.0-dev',
    node: '0.0.0-dev',
  }
  globalThis.process = {
    // @ts-ignore
    versions: mockVersions,
  }
  expect(CliVersion.handleCliArgs({})).toBe(true)
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(`0.0.0-dev`.trim())
})
