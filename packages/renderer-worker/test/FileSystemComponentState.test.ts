import { beforeEach, expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/ComponentStateWorker/ComponentStateWorker.js', () => ({
  invoke: jest.fn(),
}))

const ComponentStateWorker = await import('../src/parts/ComponentStateWorker/ComponentStateWorker.js')
const FileSystemComponentState = await import('../src/parts/FileSystem/FileSystemComponentState.js')

beforeEach(() => {
  jest.resetAllMocks()
})

test('reads and writes files through the component state worker', async () => {
  jest.mocked(ComponentStateWorker.invoke).mockResolvedValueOnce('{"uid":42}\n').mockResolvedValueOnce(undefined)

  await expect(FileSystemComponentState.readFile('live-component-state:///42.json')).resolves.toBe('{"uid":42}\n')
  await expect(FileSystemComponentState.writeFile('live-component-state:///42.json', '{"uid":42}')).resolves.toBeUndefined()

  expect(ComponentStateWorker.invoke).toHaveBeenNthCalledWith(1, 'ComponentState.readFile', 'live-component-state:///42.json')
  expect(ComponentStateWorker.invoke).toHaveBeenNthCalledWith(2, 'ComponentState.writeFile', 'live-component-state:///42.json', '{"uid":42}')
})

test('exposes an editable restorable file system', async () => {
  jest.mocked(ComponentStateWorker.invoke).mockResolvedValue(true)

  await expect(FileSystemComponentState.exists('live-component-state:///42.json')).resolves.toBe(true)
  await expect(FileSystemComponentState.stat('live-component-state:///42.json')).resolves.toEqual({ exists: true, type: 7 })
  jest.mocked(ComponentStateWorker.invoke).mockResolvedValueOnce(false)
  await expect(FileSystemComponentState.isReadonly('live-component-state:///42.json')).resolves.toBe(false)
  expect(FileSystemComponentState.canBeRestored).toBe(true)
})

test('rejects destructive operations', async () => {
  await expect(FileSystemComponentState.rename()).rejects.toThrow('Renaming component state is not allowed')
  await expect(FileSystemComponentState.remove()).rejects.toThrow('Removing component state is not allowed')
  await expect(FileSystemComponentState.mkdir()).rejects.toThrow('Creating component state directories is not allowed')
})

test('delegates DOM file read-only checks to the component state worker', async () => {
  jest.mocked(ComponentStateWorker.invoke).mockResolvedValue(true)
  await expect(FileSystemComponentState.isReadonly('live-component-state:///dom/42.json')).resolves.toBe(true)
  expect(ComponentStateWorker.invoke).toHaveBeenCalledWith('ComponentState.isReadonly', 'live-component-state:///dom/42.json')
})
