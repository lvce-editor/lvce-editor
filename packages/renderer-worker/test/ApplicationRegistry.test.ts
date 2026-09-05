import { afterEach, expect, test } from '@jest/globals'
import * as ApplicationRegistry from '../src/parts/ApplicationRegistry/ApplicationRegistry.ts'

const source = { id: 'source', layoutUid: 1, workspacePath: 'memfs:///source', workspaceUri: 'memfs:///source', href: '' }
const preview = { ...source, id: 'preview', layoutUid: 2 }

afterEach(() => {
  ApplicationRegistry.remove('source')
  ApplicationRegistry.remove('preview')
})

test('rejects component ownership collisions without changing either application', () => {
  ApplicationRegistry.create(source)
  ApplicationRegistry.create(preview)
  ApplicationRegistry.own('source', 3)

  expect(() => ApplicationRegistry.own('preview', 3)).toThrow('already belongs to application source')
  expect(ApplicationRegistry.getUids('source')).toEqual([1, 3])
  expect(ApplicationRegistry.getUids('preview')).toEqual([2])
  expect(ApplicationRegistry.getOwner(3)).toBe('source')
})

test('rejects duplicate layouts before registering a second application', () => {
  ApplicationRegistry.create(source)
  expect(() => ApplicationRegistry.create({ ...preview, layoutUid: 1 })).toThrow('duplicate layout uid')
  expect(() => ApplicationRegistry.get('preview')).toThrow('Application not found')
})

test('removing one application releases only its ownership', () => {
  ApplicationRegistry.create(source)
  ApplicationRegistry.create(preview)
  ApplicationRegistry.own('source', 3)
  ApplicationRegistry.own('preview', 4)
  ApplicationRegistry.remove('preview')

  expect(ApplicationRegistry.getOwner(2)).toBeUndefined()
  expect(ApplicationRegistry.getOwner(4)).toBeUndefined()
  expect(ApplicationRegistry.getUids('source')).toEqual([1, 3])
  expect(() => ApplicationRegistry.own('preview', 5)).toThrow('Application not found')
})

test('stores an immutable application snapshot', () => {
  const options = { ...source }
  ApplicationRegistry.create(options)
  options.workspaceUri = 'memfs:///changed'
  expect(ApplicationRegistry.get('source').workspaceUri).toBe(source.workspaceUri)
  expect(Object.isFrozen(ApplicationRegistry.get('source'))).toBe(true)
})

test('view state is isolated even for identical storage keys and resets with the application', () => {
  ApplicationRegistry.create(source)
  ApplicationRegistry.create(preview)
  const value = { selected: ['src/main.ts'] }
  ApplicationRegistry.setSavedState('source', 'Explorer', value)
  ApplicationRegistry.setSavedState('preview', 'Explorer', { selected: ['README.md'] })
  value.selected.push('extension.json')
  expect(ApplicationRegistry.getSavedState('source', 'Explorer')).toEqual({ selected: ['src/main.ts'] })
  expect(ApplicationRegistry.getSavedState('preview', 'Explorer')).toEqual({ selected: ['README.md'] })
  ApplicationRegistry.remove('preview')
  ApplicationRegistry.create(preview)
  expect(ApplicationRegistry.getSavedState('preview', 'Explorer')).toBeUndefined()
  expect(ApplicationRegistry.getSavedState('source', 'Explorer')).toEqual({ selected: ['src/main.ts'] })
})

test('closing blocks new operations and claims but waits for previously accepted work', async () => {
  ApplicationRegistry.create(source)
  ApplicationRegistry.create(preview)
  const gate = Promise.withResolvers<void>()
  const running = ApplicationRegistry.track('source', () => gate.promise)
  ApplicationRegistry.close('source')
  expect(() => ApplicationRegistry.own('source', 3)).toThrow('Application is closing')
  await expect(ApplicationRegistry.track('source', async () => {})).rejects.toThrow('Application is closing')
  ApplicationRegistry.own('preview', 4)
  const waiting = ApplicationRegistry.waitForOperations('source')
  gate.resolve()
  await running
  await waiting
  expect(ApplicationRegistry.getOwner(4)).toBe('preview')
  ApplicationRegistry.remove('source')
  ApplicationRegistry.create(source)
  expect(ApplicationRegistry.assertOpen('source').id).toBe('source')
})

test('failed operations do not keep application teardown pending', async () => {
  ApplicationRegistry.create(source)
  await expect(
    ApplicationRegistry.track('source', async () => {
      throw new Error('failed')
    }),
  ).rejects.toThrow('failed')
  ApplicationRegistry.close('source')
  await ApplicationRegistry.waitForOperations('source')
})
