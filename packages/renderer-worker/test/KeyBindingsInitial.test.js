import { jest } from '@jest/globals'
import * as Ajax from '../src/parts/Ajax/Ajax.js'
import * as CacheStorage from '../src/parts/CacheStorage/CacheStorage.js'
import * as KeyBindingsInitial from '../src/parts/KeyBindingsInitial/KeyBindingsInitial.js'

test('getKeyBindings', async () => {
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
  CacheStorage.state.setJson = jest.fn(async () => {})
  expect(await KeyBindingsInitial.getKeyBindings()).toEqual([
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

test('getKeyBindings - empty', async () => {
  Ajax.state.getJson = jest.fn(async () => {
    return []
  })
  CacheStorage.state.setJson = jest.fn(async () => {})
  expect(await KeyBindingsInitial.getKeyBindings()).toEqual([])
})

test('getKeyBindings - wrong shape', async () => {
  Ajax.state.getJson = jest.fn(async () => {
    return null
  })
  CacheStorage.state.setJson = jest.fn(async () => {})
  await expect(KeyBindingsInitial.getKeyBindings()).rejects.toThrowError(
    new Error("Cannot read properties of null (reading 'map')")
  )
})

test.skip('getKeyBindings - error with cache storage', async () => {
  Ajax.state.getJson = jest.fn(async () => {
    return []
  })
  CacheStorage.state.setJson = jest.fn(async () => {
    throw new Error('CacheStorage.put is not a function')
  })
  await expect(KeyBindingsInitial.getKeyBindings()).rejects.toThrowError(
    new Error('CacheStorage.put is not a function')
  )
})

test('getKeyBindings - error with ajax', async () => {
  Ajax.state.getJson = jest.fn(async () => {
    throw new Error('404 - not found')
  })
  CacheStorage.state.setJson = jest.fn(async () => {})
  await expect(KeyBindingsInitial.getKeyBindings()).rejects.toThrowError(
    new Error(
      'Failed to request json from "/config/defaultKeyBindings.json": 404 - not found'
    )
  )
})
