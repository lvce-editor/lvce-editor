import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('electron', () => {
  return {
    app: {
      exit() {},
    },
    BrowserWindow: class {},
    MessageChannelMain: class {},
  }
})

const Cli = await import('../src/parts/Cli/Cli.js')

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
    }),
  ).toBe(false)
  expect(spy).not.toHaveBeenCalled()
})
