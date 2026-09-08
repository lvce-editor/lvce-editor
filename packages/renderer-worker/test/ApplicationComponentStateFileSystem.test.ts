import { afterEach, expect, jest, test } from '@jest/globals'
import * as Registry from '../src/parts/ApplicationRegistry/ApplicationRegistry.ts'

jest.unstable_mockModule('../src/parts/FileSystem/FileSystemComponentState.js', () => ({
  exists: jest.fn(async () => true),
  isReadonly: jest.fn(async () => false),
  readFile: jest.fn(async () => '{"uid":201}'),
  writeFile: jest.fn(async () => {}),
}))
jest.unstable_mockModule('../src/parts/ComponentState/ComponentState.js', () => ({
  getComponents: jest.fn(() => [{ editable: true, uid: 201 }]),
}))
const FileSystem = await import('../src/parts/ApplicationComponentStateFileSystem/ApplicationComponentStateFileSystem.ts')
const Provider = await import('../src/parts/FileSystem/FileSystemComponentState.js')
const ComponentState = await import('../src/parts/ComponentState/ComponentState.js')

afterEach(() => {
  Registry.remove('preview')
  jest.clearAllMocks()
})

const setup = () => {
  Registry.create({ href: '', id: 'preview', layoutUid: 200, rootId: 'preview', workspacePath: '', workspaceUri: '' })
  Registry.own('preview', 201)
}

test('reads and writes owned state, DOM and schema files through the built-in provider', async () => {
  setup()
  for (const path of ['201.json', 'dom/201.json', 'schemas/201.json']) {
    const uri = `live-component-state:///${path}`
    expect(await FileSystem.execute('preview', 'readFile', uri)).toBe('{"uid":201}')
    expect(Provider.readFile).toHaveBeenLastCalledWith(uri)
  }
  await FileSystem.execute('preview', 'writeFile', 'live-component-state:///201.json', '{"uid":201}')
  expect(Provider.writeFile).toHaveBeenCalledWith('live-component-state:///201.json', '{"uid":201}')
})

test('refuses another application component and malformed state URIs', async () => {
  setup()
  for (const uri of ['live-component-state:///101.json', 'live-component-state:///missing.json', 'live-component-state://host/201.json']) {
    await expect(FileSystem.execute('preview', 'readFile', uri)).rejects.toThrow()
    await expect(FileSystem.execute('preview', 'writeFile', uri, '{}')).rejects.toThrow()
    expect(await FileSystem.execute('preview', 'exists', uri)).toBe(false)
  }
  expect(Provider.readFile).not.toHaveBeenCalled()
  expect(Provider.writeFile).not.toHaveBeenCalled()
})

test('lists only the application components and rejects unsupported operations', async () => {
  setup()
  expect(await FileSystem.execute('preview', 'readDirWithFileTypes', 'live-component-state:///')).toEqual([{ name: '201.json', type: 7 }])
  expect(ComponentState.getComponents).toHaveBeenCalledWith(200)
  await expect(FileSystem.execute('preview', 'getBlob', 'live-component-state:///201.json')).rejects.toThrow('Unsupported')
})
