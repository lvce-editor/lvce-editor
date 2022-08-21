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

const CliVersion = require('../src/parts/Cli/CliVersion.js')

test('handleCliArgs', async () => {
  const spy = jest.spyOn(console, 'info')
  expect(CliVersion.handleCliArgs({})).toBe(true)
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(`0.0.0-dev
unknown commit`)
})
