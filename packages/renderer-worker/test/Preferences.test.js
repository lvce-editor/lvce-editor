import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
  for (const key in Preferences.state) {
    delete Preferences.state[key]
  }
})

jest.unstable_mockModule(
  '../src/parts/RendererProcess/RendererProcess.js',
  () => {
    return {
      invoke: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)
jest.unstable_mockModule('../src/parts/SharedProcess/SharedProcess.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)
const SharedProcess = await import(
  '../src/parts/SharedProcess/SharedProcess.js'
)

const Preferences = await import('../src/parts/Preferences/Preferences.js')

const Main = await import('../src/parts/Viewlet/ViewletMain.js')

test.skip('openSettingsJson', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  Main.openUri.mockImplementation(() => {})
  await Preferences.openSettingsJson()
  expect(Main.openUri).toHaveBeenCalledTimes(1)
  expect(Main.openUri).toHaveBeenCalledWith('app://settings.json')
})

test.skip('openKeyBindingsJson', async () => {
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  Main.openUri.mockImplementation(() => {})
  await Preferences.openKeyBindingsJson()
  expect(Main.openUri).toHaveBeenCalledTimes(1)
  expect(Main.openUri).toHaveBeenCalledWith('app://keyBindings.json')
})

test('hydrate', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'Preferences.getAll':
        return {
          'editor.fontSize': 14,
          'editor.fontFamily': "'Fira Code'",
        }
      default:
        throw new Error('unexpected message')
    }
  })
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  await Preferences.hydrate()
  expect(Preferences.state).toEqual({
    'editor.fontSize': 14,
    'editor.fontFamily': "'Fira Code'",
  })
})

test('hydrate - error', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'Preferences.getAll':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  // TODO should handle error gracefully
  await expect(Preferences.hydrate()).rejects.toThrowError(
    new Error('x is not a function')
  )
})

test('get', () => {
  Object.assign(Preferences.state, { x: 42 })
  expect(Preferences.get('x')).toBe(42)
})

test('set', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'Platform.getUserSettingsPath':
        return ''
      case 'FileSystem.writeFile':
        return null
      default:
        throw new Error('unexpected message')
    }
  })
  await Preferences.set('x', 42)
  expect(SharedProcess.invoke).toHaveBeenCalledTimes(2)
  expect(SharedProcess.invoke).toHaveBeenNthCalledWith(
    1,
    'Platform.getUserSettingsPath'
  )
  expect(SharedProcess.invoke).toHaveBeenNthCalledWith(
    2,
    'FileSystem.writeFile',
    '',
    `{
  \"x\": 42
}
`
  )
})

test('set - error - getUserSettingsPath', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'Platform.getUserSettingsPath':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(Preferences.set('x', 42)).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('set - error - writeFile', async () => {
  // @ts-ignore
  SharedProcess.invoke.mockImplementation((method, ...params) => {
    switch (method) {
      case 'Platform.getUserSettingsPath':
        return ''
      case 'FileSystem.writeFile':
        throw new TypeError('x is not a function')
      default:
        throw new Error('unexpected message')
    }
  })
  await expect(Preferences.set('x', 42)).rejects.toThrowError(
    new Error('Failed to write : x is not a function')
  )
})
