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
  const spy = jest.spyOn(console, 'info')
  expect(CliHelp.handleCliArgs({})).toBe(true)
  expect(spy).toHaveBeenCalledWith('TODO print help')
})
