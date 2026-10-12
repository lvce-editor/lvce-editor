import { beforeEach, expect, jest, test } from '@jest/globals'

const readDir = jest.fn<(path: string) => Promise<any>>()
const getManifest = jest.fn<(path: string) => Promise<any>>()
const getEnablement = jest.fn<() => Promise<{ disabledExtensionIds: string[]; enabledExtensionIds: string[] }>>()
let production = true

jest.unstable_mockModule('../src/parts/Platform/Platform.ts', () => ({
  get isProduction(): boolean {
    return production
  },
}))
jest.unstable_mockModule('../src/parts/BuiltinExtensionsPath/BuiltinExtensionsPath.ts', () => ({
  getBuiltinExtensionsPath: (): string => '/app/extensions',
}))
jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.ts', () => ({ readDirWithFileTypes: readDir }))
jest.unstable_mockModule('../src/parts/ExtensionManifest/ExtensionManifest.ts', () => ({ get: getManifest }))

jest.unstable_mockModule('../src/parts/ExtensionManagement/ExtensionManagement.ts', () => ({ getExtensionEnablement: getEnablement }))

const { Directory } = await import('../src/parts/DirentType/DirentType.ts')
const { Rejected, Resolved } = await import('../src/parts/ExtensionManifestStatus/ExtensionManifestStatus.ts')
let getExtensionManifests: (path: string, fields?: readonly string[]) => Promise<any>

beforeEach(async () => {
  jest.resetModules()
  jest.clearAllMocks()
  production = true
  getEnablement.mockResolvedValue({ disabledExtensionIds: [], enabledExtensionIds: [] })
  readDir.mockResolvedValue([{ name: 'builtin.example', type: Directory }])
  getManifest.mockResolvedValue({
    contributes: { commands: ['example'] },
    id: 'builtin.example',
    path: '/app/extensions/builtin.example',
    status: Resolved,
  })
  const module = await import('../src/parts/ExtensionManifests/ExtensionManifestsFromFolder.ts')
  getExtensionManifests = module.getExtensionManifests
})

test('concurrent and repeated production builtin reads share one filesystem load', async () => {
  const results = await Promise.all([getExtensionManifests('/app/extensions'), getExtensionManifests('/app/extensions')])
  expect(results[0]).toEqual(results[1])
  results[0][0].disabled = true
  results[0][0].contributes.commands.push('changed')
  expect(await getExtensionManifests('/app/extensions')).toEqual([
    { contributes: { commands: ['example'] }, id: 'builtin.example', path: '/app/extensions/builtin.example', status: Resolved },
  ])
  expect(readDir).toHaveBeenCalledTimes(1)
  expect(getManifest).toHaveBeenCalledTimes(1)
})

test('installed and linked extension folders remain live in production', async () => {
  await getExtensionManifests('/user/extensions')
  getManifest.mockResolvedValueOnce({ id: 'new-extension', status: Resolved })
  expect(await getExtensionManifests('/user/extensions')).toEqual([{ id: 'new-extension', status: Resolved }])
  expect(readDir).toHaveBeenCalledTimes(2)
})

test('development builtin edits remain live', async () => {
  production = false
  jest.resetModules()
  const module = await import('../src/parts/ExtensionManifests/ExtensionManifestsFromFolder.ts')
  getExtensionManifests = module.getExtensionManifests
  await getExtensionManifests('/app/extensions')
  await getExtensionManifests('/app/extensions')
  expect(readDir).toHaveBeenCalledTimes(2)
})

test('failed directory loads are retried', async () => {
  readDir.mockRejectedValueOnce(Object.assign(new Error('missing'), { code: 'ENOENT' }))
  expect(await getExtensionManifests('/app/extensions')).toEqual([])
  expect(await getExtensionManifests('/app/extensions')).toHaveLength(1)
  expect(readDir).toHaveBeenCalledTimes(2)
})

test('rejected manifests are retried without losing error details', async () => {
  const reason = new Error('invalid manifest')
  getManifest.mockResolvedValueOnce({ reason, status: Rejected })
  expect((await getExtensionManifests('/app/extensions'))[0].reason).toBe(reason)
  expect((await getExtensionManifests('/app/extensions'))[0].status).toBe(Resolved)
  expect(readDir).toHaveBeenCalledTimes(2)
})

test('enablement changes are applied on every request to cached builtin manifests', async () => {
  const { getAll } = await import('../src/parts/ExtensionManifests/ExtensionManifests.ts')
  const { Folder } = await import('../src/parts/ExtensionManifestInputType/ExtensionManifestInputType.ts')
  const inputs = [{ path: '/app/extensions', type: Folder }]
  expect((await getAll(inputs, '/app/extensions'))[0].disabled).toBe(false)
  getEnablement.mockResolvedValue({ disabledExtensionIds: ['builtin.example'], enabledExtensionIds: [] })
  expect((await getAll(inputs, '/app/extensions'))[0].disabled).toBe(true)
  getEnablement.mockResolvedValue({ disabledExtensionIds: [], enabledExtensionIds: ['builtin.example'] })
  expect((await getAll(inputs, '/app/extensions'))[0].disabled).toBe(false)
  expect(readDir).toHaveBeenCalledTimes(1)
})

test('unexpected filesystem errors propagate and do not poison the cache', async () => {
  readDir.mockRejectedValueOnce(Object.assign(new Error('permission denied'), { code: 'EACCES' }))
  await expect(getExtensionManifests('/app/extensions')).rejects.toThrow('Failed to get extension manifests')
  expect(await getExtensionManifests('/app/extensions')).toHaveLength(1)
  expect(readDir).toHaveBeenCalledTimes(2)
})

test('field selection clones only requested metadata without changing the full cached manifest', async () => {
  const selected = await getExtensionManifests('/app/extensions', ['id', 'contributes', 'missing', 'toString'])
  expect(selected).toEqual([{ contributes: { commands: ['example'] }, id: 'builtin.example' }])
  selected[0].contributes.commands.push('changed')
  expect((await getExtensionManifests('/app/extensions'))[0].contributes.commands).toEqual(['example'])
  expect(await getExtensionManifests('/app/extensions', [])).toEqual([{}])
  expect(readDir).toHaveBeenCalledTimes(1)
})

test('selected results preserve deduplication and live enablement even when identity fields are omitted', async () => {
  const { getAll } = await import('../src/parts/ExtensionManifests/ExtensionManifests.ts')
  const { Folder } = await import('../src/parts/ExtensionManifestInputType/ExtensionManifestInputType.ts')
  const inputs = [
    { path: '/app/extensions', type: Folder },
    { path: '/app/extensions', type: Folder },
  ]
  expect(await getAll(inputs, '/app/extensions', ['disabled', 'builtin'])).toEqual([{ builtin: true, disabled: false }])
  getEnablement.mockResolvedValue({ disabledExtensionIds: ['builtin.example'], enabledExtensionIds: [] })
  expect(await getAll(inputs, '/app/extensions', ['disabled', 'builtin'])).toEqual([{ builtin: true, disabled: true }])
  expect((await getExtensionManifests('/app/extensions'))[0].builtin).toBeUndefined()
  expect(readDir).toHaveBeenCalledTimes(1)
})

test('field selection cannot hide rejected manifests from cache retry', async () => {
  getManifest.mockResolvedValueOnce({ id: 'builtin.example', reason: new Error('invalid manifest'), status: Rejected })
  expect(await getExtensionManifests('/app/extensions', ['id'])).toEqual([{ id: 'builtin.example' }])
  expect((await getExtensionManifests('/app/extensions'))[0].status).toBe(Resolved)
  expect(readDir).toHaveBeenCalledTimes(2)
})
