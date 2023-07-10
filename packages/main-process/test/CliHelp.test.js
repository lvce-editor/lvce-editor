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

const CliHelp = await import('../src/parts/CliHelp/CliHelp.js')

test.skip('handleCliArgs', async () => {
  const spy = jest.spyOn(console, 'info').mockImplementation()
  expect(CliHelp.handleCliArgs({})).toBe(true)
  expect(spy).toHaveBeenCalledWith(`lvce-oss v0.0.0-dev

Usage:
  lvce-oss [path]
`)
})
