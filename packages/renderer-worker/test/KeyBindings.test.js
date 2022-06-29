import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
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

jest.unstable_mockModule('../src/parts/ErrorHandling/ErrorHandling.js', () => {
  return {
    handleError: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/Ajax/Ajax.js', () => {
  return {
    getJson: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/CacheStorage/CacheStorage.js', () => {
  return {
    getJson: jest.fn(() => {
      throw new Error('not implemented')
    }),
    setJson: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const RendererProcess = await import(
  '../src/parts/RendererProcess/RendererProcess.js'
)

const ErrorHandling = await import(
  '../src/parts/ErrorHandling/ErrorHandling.js'
)
const CacheStorage = await import('../src/parts/CacheStorage/CacheStorage.js')

const Ajax = await import('../src/parts/Ajax/Ajax.js')

const KeyBindings = await import('../src/parts/KeyBindings/KeyBindings.js')

// TODO when https://github.com/facebook/jest/issues/11598 is fixed, could use spyOn(CacheStorage.getJsonFromCache)
test.skip('hydrate - use data from cache storage first', async () => {
  // @ts-ignore
  ErrorHandling.handleError.mockImplementation(() => {})
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  Ajax.getJson.mockImplementation(() => {
    return []
  })
  // @ts-ignore
  CacheStorage.getJson.mockImplementation(() => {
    return [
      {
        key: 'ArrowDown',
        command: 985,
        when: 'focus.editorCompletions',
      },
      {
        key: 'ArrowUp',
        command: 986,
        when: 'focus.editorCompletions',
      },
    ]
  })
  // @ts-ignore
  ErrorHandling.handleError.mockImplementation(() => {})
  await KeyBindings.hydrate()
  expect(ErrorHandling.handleError).not.toHaveBeenCalled()
  expect(Ajax.getJson).not.toHaveBeenCalled()
  expect(RendererProcess.invoke).toHaveBeenCalledWith([
    755,
    [
      {
        command: 985,
        key: 'ArrowDown',
        when: 'focus.editorCompletions',
      },
      {
        command: 986,
        key: 'ArrowUp',
        when: 'focus.editorCompletions',
      },
    ],
  ])
})

test('hydrate - use data from ajax when not available from cache storage', async () => {
  // @ts-ignore
  ErrorHandling.handleError.mockImplementation(() => {})
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  Ajax.getJson.mockImplementation(() => {
    return [
      {
        key: 'ArrowDown',
        command: 'editorCompletion.focusNext',
        when: 'focus.editorCompletions',
      },
      {
        key: 'ArrowUp',
        command: 'editorCompletion.focusPrevious',
        when: 'focus.editorCompletions',
      },
    ]
  })
  // @ts-ignore
  CacheStorage.getJson.mockImplementation(() => {
    return undefined
  })
  // @ts-ignore
  CacheStorage.setJson.mockImplementation(() => {})
  // @ts-ignore
  ErrorHandling.handleError.mockImplementation(() => {})
  await KeyBindings.hydrate()
  expect(ErrorHandling.handleError).not.toHaveBeenCalled()
  expect(RendererProcess.invoke).toHaveBeenCalledWith(755, [
    {
      command: 985,
      key: 'ArrowDown',
      when: 'focus.editorCompletions',
    },
    {
      command: 986,
      key: 'ArrowUp',
      when: 'focus.editorCompletions',
    },
  ])
})

test.skip('hydrate - use data from ajax when not available from cache storage but fails to put item into cache', async () => {
  // @ts-ignore
  ErrorHandling.handleError.mockImplementation(() => {})
  // @ts-ignore
  RendererProcess.invoke.mockImplementation(() => {})
  // @ts-ignore
  Ajax.getJson.mockImplementation(() => {
    return [
      {
        key: 'ArrowDown',
        command: 'editorCompletion.focusNext',
        when: 'focus.editorCompletions',
      },
      {
        key: 'ArrowUp',
        command: 'editorCompletion.focusPrevious',
        when: 'focus.editorCompletions',
      },
    ]
  })
  // @ts-ignore
  CacheStorage.getJson.mockImplementation(() => {
    return undefined
  })
  // @ts-ignore
  CacheStorage.setJson.mockImplementation(() => {
    throw new Error('Failed to put json into cache "/keybindings.json"')
  })
  // @ts-ignore

  ErrorHandling.handleError.mockImplementation(() => {})

  await KeyBindings.hydrate()
  expect(ErrorHandling.state.handleError).toHaveBeenCalledWith(
    new Error('Failed to load KeyBindings')
  )
})

test('hydrate - error with ajax', async () => {
  // @ts-ignore
  ErrorHandling.handleError.mockImplementation(() => {})
  // @ts-ignore
  Ajax.getJson.mockImplementation(() => {
    throw new Error('404 - not found')
  })
  // @ts-ignore
  CacheStorage.getJson.mockImplementation(() => {
    return undefined
  })
  await KeyBindings.hydrate()
  expect(ErrorHandling.handleError).toHaveBeenCalledTimes(1)
  expect(ErrorHandling.handleError).toHaveBeenCalledWith(
    new Error('Failed to load KeyBindings')
  )
})

test.skip('hydrate - error with cache storage', async () => {
  // @ts-ignore
  ErrorHandling.handleError.mockImplementation(() => {})
  // @ts-ignore
  Ajax.getJson.mockImplementation(() => {
    return []
  })
  // @ts-ignore
  CacheStorage.getJson.mockImplementation(() => {
    throw new Error('CacheStorage is not available')
  })
  await KeyBindings.hydrate()
  expect(ErrorHandling.handleError).toHaveBeenCalledTimes(1)
  expect(ErrorHandling.handleError).toHaveBeenCalledWith(
    new Error('Failed to load KeyBindings')
  )
})
