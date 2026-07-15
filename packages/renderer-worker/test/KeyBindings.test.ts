import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => {
  return {
    invoke: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/Logger/Logger.js', () => {
  return {
    warn: jest.fn(),
  }
})

const KeyBindingsState = await import('../src/parts/KeyBindingsState/KeyBindingsState.js')
const Logger = await import('../src/parts/Logger/Logger.js')
const RendererProcess = await import('../src/parts/RendererProcess/RendererProcess.js')

beforeEach(() => {
  jest.resetAllMocks()
  KeyBindingsState.state.keyBindings = []
  KeyBindingsState.state.keyBindingSets = Object.create(null)
  KeyBindingsState.state.keyBindingSetCounts = Object.create(null)
  KeyBindingsState.state.keyBindingIdentifiers = new Uint32Array()
  KeyBindingsState.state.matchingKeyBindings = []
})

test('addKeyBindings increments refcount when keybinding set is already registered', () => {
  const keyBindings = [
    {
      key: 1,
      command: 'test.command',
    },
  ]

  KeyBindingsState.addKeyBindings('Editor', keyBindings)
  KeyBindingsState.addKeyBindings('Editor', keyBindings)

  expect(Logger.warn).not.toHaveBeenCalled()
  expect(KeyBindingsState.state.keyBindingSets.Editor).toBe(keyBindings)
  expect(KeyBindingsState.state.keyBindingSetCounts.Editor).toBe(2)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('KeyBindings.setIdentifiers', new Uint32Array([1]))
})

test('removeKeyBindings unregisters keybinding set after last reference is removed', () => {
  const keyBindings = [
    {
      key: 1,
      command: 'test.command',
    },
  ]

  KeyBindingsState.addKeyBindings('Editor', keyBindings)
  KeyBindingsState.addKeyBindings('Editor', keyBindings)
  KeyBindingsState.removeKeyBindings('Editor')

  expect(KeyBindingsState.state.keyBindingSets.Editor).toBe(keyBindings)
  expect(KeyBindingsState.state.keyBindingSetCounts.Editor).toBe(1)
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)

  KeyBindingsState.removeKeyBindings('Editor')

  expect(KeyBindingsState.state.keyBindingSets.Editor).toBeUndefined()
  expect(KeyBindingsState.state.keyBindingSetCounts.Editor).toBeUndefined()
  expect(RendererProcess.invoke).toHaveBeenCalledTimes(2)
  expect(RendererProcess.invoke).toHaveBeenLastCalledWith('KeyBindings.setIdentifiers', new Uint32Array())
})
