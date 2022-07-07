/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RendererWorker/RendererWorker.js',
  () => {
    return {
      send: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

const RendererWorker = await import(
  '../src/parts/RendererWorker/RendererWorker.js'
)

const KeyBindings = await import('../src/parts/KeyBindings/KeyBindings.js')
const Context = await import('../src/parts/Context/Context.js')

afterAll(() => {
  if (KeyBindings.state.modifierTimeout !== -1) {
    clearTimeout(KeyBindings.state.modifierTimeout)
    KeyBindings.state.modifierTimeout = -1
  }
  KeyBindings.state.modifier = ''
})

test('hydrate', async () => {
  await KeyBindings.hydrate([
    {
      key: 'a',
      command: 14,
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'a',
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'KeyBindings.handleKeyBinding',
    {
      command: 14,
      key: 'a',
    }
  )
})

test('hydrate - dispatch event with no matching keyBinding', async () => {
  await KeyBindings.hydrate([
    {
      key: 'a',
      command: 14,
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'b',
    })
  )
  expect(RendererWorker.send).not.toHaveBeenCalled()
})

test('hydrate - dispatch Event with context not matching', async () => {
  await KeyBindings.hydrate([
    {
      key: 'a',
      command: 14,
      when: 'testContext',
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'a',
    })
  )
  expect(RendererWorker.send).not.toHaveBeenCalled()
})

test('hydrate - dispatch Event with context matching', async () => {
  await KeyBindings.hydrate([
    {
      key: 'a',
      command: 14,
      when: 'testContext',
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  Context.set('testContext', true)
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'a',
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'KeyBindings.handleKeyBinding',
    {
      command: 14,
      key: 'a',
      when: 'testContext',
    }
  )
})

test('hydrate - dispatch Event with Arrow Key', async () => {
  await KeyBindings.hydrate([
    {
      key: 'ArrowLeft',
      command: 14,
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'ArrowLeft',
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'KeyBindings.handleKeyBinding',
    {
      command: 14,
      key: 'ArrowLeft',
    }
  )
})

test('hydrate - dispatch event with ctrl modifier', async () => {
  await KeyBindings.hydrate([
    {
      key: 'ctrl+a',
      command: 14,
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'a',
      ctrlKey: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'KeyBindings.handleKeyBinding',
    {
      command: 14,
      key: 'ctrl+a',
    }
  )
})

test('hydrate - dispatch event with shift modifier', async () => {
  await KeyBindings.hydrate([
    {
      key: 'shift+a',
      command: 14,
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'a',
      shiftKey: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'KeyBindings.handleKeyBinding',
    {
      command: 14,
      key: 'shift+a',
    }
  )
})

test('hydrate - dispatch event with alt modifier', async () => {
  await KeyBindings.hydrate([
    {
      key: 'alt+a',
      command: 14,
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'a',
      altKey: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'KeyBindings.handleKeyBinding',
    {
      command: 14,
      key: 'alt+a',
    }
  )
})

test('hydrate - dispatch event with space key', async () => {
  await KeyBindings.hydrate([
    {
      key: 'Space',
      command: 14,
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: ' ',
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'KeyBindings.handleKeyBinding',
    {
      command: 14,
      key: 'Space',
    }
  )
})

test('hydrate - dispatch event with double shift key', async () => {
  await KeyBindings.hydrate([
    {
      key: 'shift shift',
      command: 14,
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Shift',
      shiftKey: true,
    })
  )
  window.dispatchEvent(
    new KeyboardEvent('keyup', {
      key: 'Shift',
      shiftKey: true,
    })
  )
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Shift',
      shiftKey: true,
    })
  )
  expect(RendererWorker.send).not.toHaveBeenCalled()
  window.dispatchEvent(
    new KeyboardEvent('keyup', {
      key: 'Shift',
      shiftKey: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'KeyBindings.handleKeyBinding',
    {
      command: 14,
      key: 'shift shift',
    }
  )
})

test('hydrate - dispatch event with double alt key', async () => {
  await KeyBindings.hydrate([
    {
      key: 'alt alt',
      command: 14,
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Alt',
      altKey: true,
    })
  )
  window.dispatchEvent(
    new KeyboardEvent('keyup', {
      key: 'Alt',
      altKey: true,
    })
  )
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Alt',
      altKey: true,
    })
  )
  expect(RendererWorker.send).not.toBeCalled()
  window.dispatchEvent(
    new KeyboardEvent('keyup', {
      key: 'Alt',
      altKey: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'KeyBindings.handleKeyBinding',
    {
      command: 14,
      key: 'alt alt',
    }
  )
})

test('hydrate - dispatch event with double ctrl key', async () => {
  await KeyBindings.hydrate([
    {
      key: 'ctrl ctrl',
      command: 14,
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Control',
      ctrlKey: true,
    })
  )
  window.dispatchEvent(
    new KeyboardEvent('keyup', {
      key: 'Control',
      ctrlKey: true,
    })
  )
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Control',
      ctrlKey: true,
    })
  )
  expect(RendererWorker.send).not.toHaveBeenCalled()
  window.dispatchEvent(
    new KeyboardEvent('keyup', {
      key: 'Control',
      ctrlKey: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'KeyBindings.handleKeyBinding',
    {
      command: 14,
      key: 'ctrl ctrl',
    }
  )
})

test('hydrate - dispatch event with ctrl alt ctrl key should not trigger ctrl ctrl', async () => {
  await KeyBindings.hydrate([
    {
      key: 'ctrl ctrl',
      command: 14,
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Control',
      ctrlKey: true,
    })
  )
  window.dispatchEvent(
    new KeyboardEvent('keyup', {
      key: 'Control',
      ctrlKey: true,
    })
  )
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Alt',
      altKey: true,
    })
  )
  window.dispatchEvent(
    new KeyboardEvent('keyup', {
      key: 'Alt',
      altKey: true,
    })
  )
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Control',
      ctrlKey: true,
    })
  )
  window.dispatchEvent(
    new KeyboardEvent('keyup', {
      key: 'Control',
      ctrlKey: true,
    })
  )
  expect(RendererWorker.send).not.toHaveBeenCalled()
})

test('hydrate - dispatch event with ctrl alt shift shift key should trigger shift shift', async () => {
  await KeyBindings.hydrate([
    {
      key: 'shift shift',
      command: 14,
    },
  ])
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Control',
      ctrlKey: true,
    })
  )
  window.dispatchEvent(
    new KeyboardEvent('keyup', {
      key: 'Control',
      ctrlKey: true,
    })
  )
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Alt',
      altKey: true,
    })
  )
  window.dispatchEvent(
    new KeyboardEvent('keyup', {
      key: 'Alt',
      altKey: true,
    })
  )
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Shift',
      shiftKey: true,
    })
  )
  window.dispatchEvent(
    new KeyboardEvent('keyup', {
      key: 'Shift',
      shiftKey: true,
    })
  )
  window.dispatchEvent(
    new KeyboardEvent('keydown', {
      key: 'Shift',
      shiftKey: true,
    })
  )
  window.dispatchEvent(
    new KeyboardEvent('keyup', {
      key: 'Shift',
      shiftKey: true,
    })
  )
  expect(RendererWorker.send).toHaveBeenCalledWith(
    'KeyBindings.handleKeyBinding',
    {
      command: 14,
      key: 'shift shift',
    }
  )
})
