beforeEach(() => {
  jest.resetModules()
})

jest.mock('electron', () => {
  return {
    app: {
      exit() {},
    },
  }
})

const CliHelp = require('../src/parts/Cli/CliHelp.js')

test('handleCliArgs', async () => {
  const spy = jest.spyOn(console, 'info').mockImplementation()
  expect(CliHelp.handleCliArgs({})).toBe(true)
  expect(spy).toHaveBeenCalledWith(`Lvce-OSS v0.0.0-dev

Usage:
  lvce-oss [path]
`)
})
