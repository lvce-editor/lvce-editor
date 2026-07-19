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

jest.unstable_mockModule('../src/parts/ExtensionKeyBindings/ExtensionKeyBindings.js', () => {
  return {
    getKeyBindings: jest.fn(() => []),
  }
})

const ExtensionKeyBindings = await import('../src/parts/ExtensionKeyBindings/ExtensionKeyBindings.js')
const KeyBindings = await import('../src/parts/KeyBindings/KeyBindings.js')
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

test('update does not send equal empty identifiers', () => {
  KeyBindingsState.update()

  expect(RendererProcess.invoke).not.toHaveBeenCalled()
  expect(KeyBindingsState.state.keyBindingIdentifiers).toEqual(new Uint32Array())
  expect(KeyBindingsState.state.matchingKeyBindings).toEqual([])
})

test('update refreshes matching keybindings without sending equal identifiers', () => {
  const previousKeyBinding = {
    key: 1,
    command: 'test.previous',
  }
  const currentKeyBinding = {
    key: 1,
    command: 'test.current',
  }
  KeyBindingsState.state.keyBindingIdentifiers = new Uint32Array([1])
  KeyBindingsState.state.matchingKeyBindings = [previousKeyBinding]
  KeyBindingsState.state.keyBindingSets.Editor = [currentKeyBinding]

  KeyBindingsState.update()

  expect(RendererProcess.invoke).not.toHaveBeenCalled()
  expect(KeyBindingsState.state.keyBindingIdentifiers).toEqual(new Uint32Array([1]))
  expect(KeyBindingsState.state.matchingKeyBindings).toEqual([currentKeyBinding])
  expect(KeyBindingsState.getKeyBinding(1)).toBe(currentKeyBinding)
})

test.each([
  {
    name: 'added',
    previous: [],
    keyBindings: [{ key: 1, command: 'test.one' }],
    expected: [1],
  },
  {
    name: 'removed',
    previous: [1],
    keyBindings: [],
    expected: [],
  },
  {
    name: 'changed',
    previous: [1],
    keyBindings: [{ key: 2, command: 'test.two' }],
    expected: [2],
  },
  {
    name: 'reordered',
    previous: [1, 2],
    keyBindings: [
      { key: 2, command: 'test.two' },
      { key: 1, command: 'test.one' },
    ],
    expected: [2, 1],
  },
])('update sends $name identifiers', ({ previous, keyBindings, expected }) => {
  KeyBindingsState.state.keyBindingIdentifiers = new Uint32Array(previous)
  KeyBindingsState.state.keyBindingSets.Editor = keyBindings

  KeyBindingsState.update()

  expect(RendererProcess.invoke).toHaveBeenCalledTimes(1)
  expect(RendererProcess.invoke).toHaveBeenCalledWith('KeyBindings.setIdentifiers', new Uint32Array(expected))
  expect(KeyBindingsState.state.keyBindingIdentifiers).toEqual(new Uint32Array(expected))
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

test('hydrate registers extension keybindings', async () => {
  const keyBindings = [
    {
      command: 'ExtensionHost.executeCommand',
      key: 3,
      when: 'chat2.composerFocus',
    },
  ]
  jest.mocked(ExtensionKeyBindings.getKeyBindings).mockResolvedValue(keyBindings)

  await KeyBindings.hydrate()

  expect(KeyBindingsState.state.keyBindingSets.extensions).toBe(keyBindings)
})
