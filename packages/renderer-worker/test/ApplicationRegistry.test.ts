import { afterEach, expect, test } from '@jest/globals'
const stored = new Map<string, Response>()
Object.defineProperty(globalThis, 'location', { configurable: true, value: { href: 'https://example.test/app/' } })
Object.defineProperty(globalThis, 'caches', {
  configurable: true,
  value: {
    open: async (): Promise<unknown> => ({
      delete: async (url: string): Promise<boolean> => stored.delete(url),
      match: async (url: string): Promise<Response | undefined> => stored.get(url)?.clone(),
      put: async (url: string, response: Response): Promise<void> => {
        stored.set(url, response.clone())
      },
    }),
  },
})
const ApplicationRegistry = await import('../src/parts/ApplicationRegistry/ApplicationRegistry.ts')

const source = { href: '', id: 'source', layoutUid: 1, workspacePath: 'memfs:///source', workspaceUri: 'memfs:///source' }
const preview = { ...source, id: 'preview', layoutUid: 2 }

afterEach(async () => {
  await ApplicationRegistry.remove('source')
  await ApplicationRegistry.remove('preview')
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

test('removing one application releases only its ownership', async () => {
  ApplicationRegistry.create(source)
  ApplicationRegistry.create(preview)
  ApplicationRegistry.own('source', 3)
  ApplicationRegistry.own('preview', 4)
  await ApplicationRegistry.remove('preview')

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

test('view state is isolated even for identical storage keys and resets with the application', async () => {
  ApplicationRegistry.create(source)
  ApplicationRegistry.create(preview)
  const value = { selected: ['src/main.ts'] }
  await ApplicationRegistry.setSavedState('source', 'Explorer', value)
  await ApplicationRegistry.setSavedState('preview', 'Explorer', { selected: ['README.md'] })
  value.selected.push('extension.json')
  expect(await ApplicationRegistry.getSavedState('source', 'Explorer')).toEqual({ selected: ['src/main.ts'] })
  expect(await ApplicationRegistry.getSavedState('preview', 'Explorer')).toEqual({ selected: ['README.md'] })
  await ApplicationRegistry.remove('preview')
  ApplicationRegistry.create(preview)
  expect(await ApplicationRegistry.getSavedState('preview', 'Explorer')).toBeUndefined()
  expect(await ApplicationRegistry.getSavedState('source', 'Explorer')).toEqual({ selected: ['src/main.ts'] })
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
  await ApplicationRegistry.remove('source')
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
