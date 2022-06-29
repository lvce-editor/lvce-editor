import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
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

const Ajax = await import('../src/parts/Ajax/Ajax.js')
const CacheStorage = await import('../src/parts/CacheStorage/CacheStorage.js')

const KeyBindingsInitial = await import(
  '../src/parts/KeyBindingsInitial/KeyBindingsInitial.js'
)

test('getKeyBindings', async () => {
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
  CacheStorage.setJson.mockImplementation(() => {})
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
  // @ts-ignore
  Ajax.getJson.mockImplementation(() => {
    return []
  })
  // @ts-ignore
  CacheStorage.setJson.mockImplementation(() => {})
  expect(await KeyBindingsInitial.getKeyBindings()).toEqual([])
})

test('getKeyBindings - wrong shape', async () => {
  // @ts-ignore
  Ajax.getJson.mockImplementation(() => {
    return null
  })
  // @ts-ignore
  CacheStorage.setJson.mockImplementation(() => {})
  await expect(KeyBindingsInitial.getKeyBindings()).rejects.toThrowError(
    new Error("Cannot read properties of null (reading 'map')")
  )
})

test.skip('getKeyBindings - error with cache storage', async () => {
  // @ts-ignore
  Ajax.getJson.mockImplementation(() => {
    return []
  })
  // @ts-ignore
  CacheStorage.setJson.mockImplementation(async () => {
    throw new Error('CacheStorage.put is not a function')
  })
  await expect(KeyBindingsInitial.getKeyBindings()).rejects.toThrowError(
    new Error('CacheStorage.put is not a function')
  )
})

test('getKeyBindings - error with ajax', async () => {
  // @ts-ignore
  Ajax.getJson.mockImplementation(async () => {
    throw new Error(
      'Failed to request json from "/config/defaultKeyBindings.json": 404 - not found'
    )
  })
  // @ts-ignore
  CacheStorage.setJson.mockImplementation(() => {})
  await expect(KeyBindingsInitial.getKeyBindings()).rejects.toThrowError(
    new Error(
      'Failed to request json from "/config/defaultKeyBindings.json": 404 - not found'
    )
  )
})
