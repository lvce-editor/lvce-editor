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

test('parseCliArgs', () => {
  expect(Cli.parseCliArgs(['/usr/lib/lvce-oss/lvce-oss', '/test/'])).toEqual({
    _: ['/test/'],
    help: false,
    v: false,
    version: false,
    wait: false,
    'built-in-self-test': false,
    web: false,
    install: false,
    sandbox: false,
  })
})

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
