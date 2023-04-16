/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.js', () => {
  return {
    send: jest.fn(() => {}),
  }
})

const RendererWorker = await import('../src/parts/RendererWorker/RendererWorker.js')
const KeyBindings = await import('../src/parts/KeyBindings/KeyBindings.js')
const KeyBindingsEvents = await import('../src/parts/KeyBindingsEvents/KeyBindingsEvents.js')
const KeyBindingsState = await import('../src/parts/KeyBindingsState/KeyBindingsState.js')
const Context = await import('../src/parts/Context/Context.js')

beforeEach(() => {
  if (KeyBindingsState.state.modifierTimeout !== -1) {
    clearTimeout(KeyBindingsState.state.modifierTimeout)
    KeyBindingsState.state.modifierTimeout = -1
  }
  KeyBindingsState.state.modifier = ''
  KeyBindingsState.state.keyBindingSets = Object.create(null)
  KeyBindingsState.state.keyBindings = []
  Context.state.contexts = Object.create(null)
})

test('hydrate', () => {
  KeyBindings.hydrate([
    {
      key: 'a',
      command: 14,
    },
  ])
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'a',
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith('KeyBindings.handleKeyBinding', {
    command: 14,
    key: 'a',
  })
})

test('hydrate - dispatch event with no matching keyBinding', () => {
  KeyBindings.hydrate([
    {
      key: 'a',
      command: 14,
    },
  ])
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'b',
    })
  )
  expect(RendererWorker.send).not.toHaveBeenCalled()
})

test('hydrate - dispatch Event with context not matching', () => {
  KeyBindings.hydrate([
    {
      key: 'a',
      command: 14,
      when: 'testContext',
    },
  ])
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'a',
    })
  )
  expect(RendererWorker.send).not.toHaveBeenCalled()
})

test('hydrate - dispatch Event with context matching', () => {
  KeyBindings.addKeyBindings(1, [
    {
      key: 'a',
      command: 14,
      when: 'testContext',
    },
  ])
  Context.set('testContext', true)
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'a',
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith('KeyBindings.handleKeyBinding', {
    command: 14,
    key: 'a',
    when: 'testContext',
  })
})

test('hydrate - dispatch Event with Arrow Key', () => {
  KeyBindings.addKeyBindings(1, [
    {
      key: 'ArrowLeft',
      command: 14,
    },
  ])
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'ArrowLeft',
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith('KeyBindings.handleKeyBinding', {
    command: 14,
    key: 'ArrowLeft',
  })
})

test('hydrate - dispatch event with ctrl modifier', () => {
  KeyBindings.addKeyBindings(1, [
    {
      key: 'ctrl+a',
      command: 14,
    },
  ])
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'a',
      ctrlKey: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith('KeyBindings.handleKeyBinding', {
    command: 14,
    key: 'ctrl+a',
  })
})

test('hydrate - dispatch event with shift modifier', () => {
  KeyBindings.addKeyBindings(1, [
    {
      key: 'shift+a',
      command: 14,
    },
  ])
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'a',
      shiftKey: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith('KeyBindings.handleKeyBinding', {
    command: 14,
    key: 'shift+a',
  })
})

test('hydrate - dispatch event with alt modifier', () => {
  KeyBindings.addKeyBindings(1, [
    {
      key: 'alt+a',
      command: 14,
    },
  ])
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'a',
      altKey: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith('KeyBindings.handleKeyBinding', {
    command: 14,
    key: 'alt+a',
  })
})

test('hydrate - dispatch event with space key', () => {
  KeyBindings.addKeyBindings(1, [
    {
      key: 'Space',
      command: 14,
    },
  ])
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: ' ',
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith('KeyBindings.handleKeyBinding', {
    command: 14,
    key: 'Space',
  })
})

test('hydrate - dispatch event with double shift key', () => {
  KeyBindings.addKeyBindings(1, [
    {
      key: 'shift shift',
      command: 14,
    },
  ])
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'Shift',
      shiftKey: true,
    })
  )
  KeyBindingsEvents.handleKeyUp(
    new KeyboardEvent('keyup', {
      key: 'Shift',
      shiftKey: true,
    })
  )
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'Shift',
      shiftKey: true,
    })
  )
  expect(RendererWorker.send).not.toHaveBeenCalled()
  KeyBindingsEvents.handleKeyUp(
    new KeyboardEvent('keyup', {
      key: 'Shift',
      shiftKey: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith('KeyBindings.handleKeyBinding', {
    command: 14,
    key: 'shift shift',
  })
})

test('hydrate - dispatch event with double alt key', () => {
  KeyBindings.addKeyBindings(1, [
    {
      key: 'alt alt',
      command: 14,
    },
  ])
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'Alt',
      altKey: true,
    })
  )
  KeyBindingsEvents.handleKeyUp(
    new KeyboardEvent('keyup', {
      key: 'Alt',
      altKey: true,
    })
  )
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'Alt',
      altKey: true,
    })
  )
  expect(RendererWorker.send).not.toBeCalled()
  KeyBindingsEvents.handleKeyUp(
    new KeyboardEvent('keyup', {
      key: 'Alt',
      altKey: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith('KeyBindings.handleKeyBinding', {
    command: 14,
    key: 'alt alt',
  })
})

test('hydrate - dispatch event with double ctrl key', () => {
  KeyBindings.addKeyBindings(1, [
    {
      key: 'ctrl ctrl',
      command: 14,
    },
  ])
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'Control',
      ctrlKey: true,
    })
  )
  KeyBindingsEvents.handleKeyUp(
    new KeyboardEvent('keyup', {
      key: 'Control',
      ctrlKey: true,
    })
  )
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'Control',
      ctrlKey: true,
    })
  )
  expect(RendererWorker.send).not.toHaveBeenCalled()
  KeyBindingsEvents.handleKeyUp(
    new KeyboardEvent('keyup', {
      key: 'Control',
      ctrlKey: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith('KeyBindings.handleKeyBinding', {
    command: 14,
    key: 'ctrl ctrl',
  })
})

test('hydrate - dispatch event with ctrl alt ctrl key should not trigger ctrl ctrl', () => {
  KeyBindings.hydrate([
    {
      key: 'ctrl ctrl',
      command: 14,
    },
  ])
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'Control',
      ctrlKey: true,
    })
  )
  KeyBindingsEvents.handleKeyUp(
    new KeyboardEvent('keyup', {
      key: 'Control',
      ctrlKey: true,
    })
  )
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'Alt',
      altKey: true,
    })
  )
  KeyBindingsEvents.handleKeyUp(
    new KeyboardEvent('keyup', {
      key: 'Alt',
      altKey: true,
    })
  )
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'Control',
      ctrlKey: true,
    })
  )
  KeyBindingsEvents.handleKeyUp(
    new KeyboardEvent('keyup', {
      key: 'Control',
      ctrlKey: true,
    })
  )
  expect(RendererWorker.send).not.toHaveBeenCalled()
})

test('hydrate - dispatch event with ctrl alt shift shift key should trigger shift shift', () => {
  KeyBindings.addKeyBindings(1, [
    {
      key: 'shift shift',
      command: 14,
    },
  ])
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'Control',
      ctrlKey: true,
    })
  )
  KeyBindingsEvents.handleKeyUp(
    new KeyboardEvent('keyup', {
      key: 'Control',
      ctrlKey: true,
    })
  )
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'Alt',
      altKey: true,
    })
  )
  KeyBindingsEvents.handleKeyUp(
    new KeyboardEvent('keyup', {
      key: 'Alt',
      altKey: true,
    })
  )
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'Shift',
      shiftKey: true,
    })
  )
  KeyBindingsEvents.handleKeyUp(
    new KeyboardEvent('keyup', {
      key: 'Shift',
      shiftKey: true,
    })
  )
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'Shift',
      shiftKey: true,
    })
  )
  KeyBindingsEvents.handleKeyUp(
    new KeyboardEvent('keyup', {
      key: 'Shift',
      shiftKey: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith('KeyBindings.handleKeyBinding', {
    command: 14,
    key: 'shift shift',
  })
})
