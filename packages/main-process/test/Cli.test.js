beforeEach(() => {
  jest.resetAllMocks()
})

jest.mock('electron', () => {
  return {
    app: {
      exit() {},
    },
  }
})

const Cli = require('../src/parts/Cli/Cli.js')

test('handleFastCliArgsMaybe - nothing matches', () => {
  const spy = jest.spyOn(console, 'info')
  expect(
    Cli.handleFastCliArgsMaybe({
      _: ['/tmp/'],
      help: false,
      v: false,
      version: false,
      wait: false,
      web: false,
    })
  ).toBe(false)
  expect(spy).not.toHaveBeenCalled()
})
