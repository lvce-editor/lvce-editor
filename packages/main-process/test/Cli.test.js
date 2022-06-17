const Cli = require('../src/parts/Cli/Cli')

jest.mock('electron', () => {
  return {
    app: {
      exit() {},
    },
  }
})

afterEach(() => {
  jest.restoreAllMocks()
})

test('parseCliArgs', () => {
  expect(Cli.parseCliArgs(['/usr/lib/lvce-oss/lvce-oss', '/tmp/'])).toEqual({
    _: ['/tmp/'],
    help: false,
    v: false,
    version: false,
    wait: false,
    'built-in-self-test': false,
    web: false,
  })
})

test('handleFastCliArgsMaybe - version', () => {
  const spy = jest.spyOn(console, 'info')
  expect(
    Cli.handleFastCliArgsMaybe({
      _: ['/tmp/'],
      help: false,
      v: false,
      version: true,
      wait: false,
      web: false,
    })
  ).toBe(true)
  expect(spy).toHaveBeenCalledWith(`0.0.0-dev
unknown commit`)
})

test('handleFastCliArgsMaybe - help', () => {
  const spy = jest.spyOn(console, 'info')
  expect(
    Cli.handleFastCliArgsMaybe({
      _: ['/tmp/'],
      help: true,
      v: false,
      version: false,
      wait: false,
      web: false,
    })
  ).toBe(true)
  expect(spy).toHaveBeenCalledWith('TODO print help')
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
