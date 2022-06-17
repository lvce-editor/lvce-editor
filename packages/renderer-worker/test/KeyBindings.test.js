import { jest } from '@jest/globals'
import * as ErrorHandling from '../src/parts/ErrorHandling/ErrorHandling.js'
import * as KeyBindings from '../src/parts/KeyBindings/KeyBindings.js'
import * as Ajax from '../src/parts/Ajax/Ajax.js'
import * as CacheStorage from '../src/parts/CacheStorage/CacheStorage.js'
import * as RendererProcess from '../src/parts/RendererProcess/RendererProcess.js'

// TODO when https://github.com/facebook/jest/issues/11598 is fixed, could use spyOn(CacheStorage.getJsonFromCache)
test.skip('hydrate - use data from cache storage first', async () => {
  ErrorHandling.state.handleError = jest.fn()
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  Ajax.state.getJson = jest.fn(async () => {
    return []
  })
  CacheStorage.state.getJson = jest.fn(async () => {
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
  ErrorHandling.state.handleError = jest.fn()
  await KeyBindings.hydrate()
  expect(ErrorHandling.state.handleError).not.toHaveBeenCalled()
  expect(Ajax.state.getJson).not.toHaveBeenCalled()
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
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
  ErrorHandling.state.handleError = jest.fn()
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  Ajax.state.getJson = jest.fn(async () => {
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
  CacheStorage.state.getJson = jest.fn(async () => {
    return undefined
  })
  CacheStorage.state.setJson = jest.fn(async () => {})
  ErrorHandling.state.handleError = jest.fn()
  await KeyBindings.hydrate()
  expect(ErrorHandling.state.handleError).not.toHaveBeenCalled()
  expect(RendererProcess.state.send).toHaveBeenCalledWith([
    909090,
    expect.any(Number),
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

test.skip('hydrate - use data from ajax when not available from cache storage but fails to put item into cache', async () => {
  ErrorHandling.state.handleError = jest.fn()
  RendererProcess.state.send = jest.fn((message) => {
    switch (message[0]) {
      case 909090:
        const callbackId = message[1]
        RendererProcess.state.handleMessage([
          /* Callback.resolve */ 67330,
          /* callbackId */ callbackId,
          /* result */ undefined,
        ])
        break
      default:
        throw new Error('unexpected message')
    }
  })
  Ajax.state.getJson = jest.fn(async () => {
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
  CacheStorage.state.getJson = jest.fn(async () => {
    return undefined
  })
  CacheStorage.state.setJson = jest.fn(async () => {
    throw new Error('Failed to put json into cache "/keybindings.json"')
  })
  ErrorHandling.state.handleError = jest.fn()
  await KeyBindings.hydrate()
  expect(ErrorHandling.state.handleError).toHaveBeenCalledWith(
    new Error('Failed to load KeyBindings')
  )
})

test('hydrate - error with ajax', async () => {
  ErrorHandling.state.handleError = jest.fn()
  Ajax.state.getJson = jest.fn(async () => {
    throw new Error('404 - not found')
  })
  CacheStorage.state.getJson = jest.fn(async () => {
    return undefined
  })
  await KeyBindings.hydrate()
  expect(ErrorHandling.state.handleError).toHaveBeenCalledWith(
    new Error('Failed to load KeyBindings')
  )
})

test.skip('hydrate - error with cache storage', async () => {
  ErrorHandling.state.handleError = jest.fn()
  Ajax.state.getJson = jest.fn(async () => {
    return []
  })
  CacheStorage.state.getJson = jest.fn(async () => {
    throw new Error('CacheStorage is not available')
  })
  await KeyBindings.hydrate()
  expect(ErrorHandling.state.handleError).toHaveBeenCalledWith(
    new Error('Failed to load KeyBindings')
  )
})
