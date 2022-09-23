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

jest.mock('../src/parts/Platform/Platform.js', () => {
  return {
    ProductName: 'Test',
    version: '0.0.0-dev',
  }
})

const CliVersion = require('../src/parts/CliVersion/CliVersion.js')

test('handleCliArgs', async () => {
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
  expect(spy).toHaveBeenCalledWith(
    `
Test    : 0.0.0-dev
Electron: 0.0.0-dev
Chrome  : 0.0.0-dev
Node    : 0.0.0-dev`.trim()
  )
})
