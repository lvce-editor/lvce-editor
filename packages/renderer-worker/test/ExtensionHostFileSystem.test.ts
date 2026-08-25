import { beforeEach, expect, jest, test } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.js'

const invoke = jest.fn<(...args: readonly any[]) => Promise<any>>()
const execute = jest.fn<(...args: readonly any[]) => Promise<any>>()
const rendererInvoke = jest.fn<(...args: readonly any[]) => Promise<any>>()

beforeEach(() => {
  jest.resetAllMocks()
  invoke.mockResolvedValue({ found: false })
})

jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => ({
  invoke,
}))

jest.unstable_mockModule('../src/parts/Command/Command.js', () => ({
  execute,
}))

jest.unstable_mockModule('../src/parts/RendererProcess/RendererProcess.js', () => ({
  invoke: rendererInvoke,
}))

jest.unstable_mockModule('../src/parts/ExtensionHost/ExtensionHostShared.js', () => {
  return {
    executeProvider: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ExtensionHostFileSystem = await import('../src/parts/ExtensionHost/ExtensionHostFileSystem.js')
const ExtensionHostShared = await import('../src/parts/ExtensionHost/ExtensionHostShared.js')

test('readFile', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(async () => {
    return 'test content'
  })
  expect(await ExtensionHostFileSystem.readFile('memfs:///test.txt')).toBe('test content')
})

test('readFile - wrapped extension host uri', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(async () => {
    return 'test content'
  })
  expect(await ExtensionHostFileSystem.readFile('extension-host://xyz:///test.txt')).toBe('test content')
  expect(ExtensionHostShared.executeProvider).toHaveBeenCalledTimes(1)
  expect(ExtensionHostShared.executeProvider).toHaveBeenCalledWith({
    event: 'onFileSystem:xyz',
    method: 'ExtensionHostFileSystem.readFile',
    noProviderFoundMessage: 'no file system provider found',
    params: ['xyz', '/test.txt'],
  })
})

test('readFile - error', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(ExtensionHostFileSystem.readFile('memfs:///test.txt')).rejects.toThrow(new TypeError('x is not a function'))
})

test('getBlob preserves binary provider content', async () => {
  const audio = new Blob(['recorded audio'], { type: 'audio/webm' })
  invoke.mockResolvedValue({ found: true, result: audio })

  await expect(ExtensionHostFileSystem.getBlob('gpt-voice-audio:///message.webm', 'video/webm')).resolves.toBe(audio)
})

test('getBlob converts text provider content using the requested mime type', async () => {
  invoke.mockResolvedValue({ found: true, result: 'test content' })

  const blob = await ExtensionHostFileSystem.getBlob('memfs:///test.txt', 'text/plain')

  expect(blob.type).toBe('text/plain')
  await expect(blob.text()).resolves.toBe('test content')
})

test('getBlobUrl creates an object url in the renderer process', async () => {
  const audio = new Blob(['recorded audio'], { type: 'audio/webm' })
  invoke.mockResolvedValue({ found: true, result: audio })
  rendererInvoke.mockResolvedValue('blob:recording')

  await expect(ExtensionHostFileSystem.getBlobUrl('gpt-voice-audio:///message.webm', 'video/webm')).resolves.toBe('blob:recording')
  expect(rendererInvoke).toHaveBeenCalledWith('ObjectUrl.create', audio)
})

test('remove', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(() => {})
  await ExtensionHostFileSystem.remove('memfs:///test.txt')
  expect(ExtensionHostShared.executeProvider).toHaveBeenCalledTimes(1)
  expect(ExtensionHostShared.executeProvider).toHaveBeenCalledWith({
    event: 'onFileSystem:memfs',
    method: 'ExtensionHostFileSystem.remove',
    noProviderFoundMessage: 'no file system provider found',
    params: ['memfs', '/test.txt'],
  })
  expect(execute).toHaveBeenCalledWith('Layout.handleWorkspaceRefresh', {
    deleted: ['memfs:///test.txt'],
  })
  expect(execute).toHaveBeenCalledWith('Layout.refreshSourceControlBadgeCount')
})

test('remove - error', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(ExtensionHostFileSystem.remove('memfs:///test.txt')).rejects.toThrow(new TypeError('x is not a function'))
})

test('rename', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(() => {})
  await ExtensionHostFileSystem.rename('memfs:///test.txt', 'memfs:///test2.txt')
  expect(ExtensionHostShared.executeProvider).toHaveBeenCalledTimes(1)
  expect(ExtensionHostShared.executeProvider).toHaveBeenCalledWith({
    event: 'onFileSystem:memfs',
    method: 'ExtensionHostFileSystem.rename',
    noProviderFoundMessage: 'no file system provider found',
    params: ['memfs', '/test.txt', '/test2.txt'],
  })
  expect(execute).toHaveBeenCalledWith('Layout.handleWorkspaceRefresh', {
    renamed: [['memfs:///test.txt', 'memfs:///test2.txt']],
  })
  expect(execute).toHaveBeenCalledWith('Layout.refreshSourceControlBadgeCount')
})

test('rename - wrapped extension host uri', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(() => {})
  await ExtensionHostFileSystem.rename('extension-host://xyz:///test.txt', 'extension-host://xyz:///test2.txt')
  expect(ExtensionHostShared.executeProvider).toHaveBeenCalledTimes(1)
  expect(ExtensionHostShared.executeProvider).toHaveBeenCalledWith({
    event: 'onFileSystem:xyz',
    method: 'ExtensionHostFileSystem.rename',
    noProviderFoundMessage: 'no file system provider found',
    params: ['xyz', '/test.txt', '/test2.txt'],
  })
})

test('rename - error', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  // @ts-ignore
  await expect(ExtensionHostFileSystem.rename('memfs', 'memfs:///test.txt', 'memfs:///test2.txt')).rejects.toThrow(
    new TypeError('x is not a function'),
  )
})

test('mkdir', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(() => {})
  await ExtensionHostFileSystem.mkdir('memfs:///test-folder')
  expect(ExtensionHostShared.executeProvider).toHaveBeenCalledTimes(1)
  expect(ExtensionHostShared.executeProvider).toHaveBeenCalledWith({
    event: 'onFileSystem:memfs',
    method: 'ExtensionHostFileSystem.mkdir',
    noProviderFoundMessage: 'no file system provider found',
    params: ['memfs', '/test-folder'],
  })
})

test('mkdir - error', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(ExtensionHostFileSystem.mkdir('memfs:///test-folder')).rejects.toThrow(new TypeError('x is not a function'))
})

test('writeFile', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(() => {})
  await ExtensionHostFileSystem.writeFile('memfs:///test-folder', 'test')
  expect(ExtensionHostShared.executeProvider).toHaveBeenCalledTimes(1)
  expect(ExtensionHostShared.executeProvider).toHaveBeenCalledWith({
    event: 'onFileSystem:memfs',
    method: 'ExtensionHostFileSystem.writeFile',
    noProviderFoundMessage: 'no file system provider found',
    params: ['memfs', '/test-folder', 'test'],
  })
  expect(execute).toHaveBeenCalledWith('Layout.handleWorkspaceRefresh', {
    changed: ['memfs:///test-folder'],
  })
  expect(execute).toHaveBeenCalledWith('Layout.refreshSourceControlBadgeCount')
})

test('createFile notifies workspace views with the changed uri', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(() => {})

  await ExtensionHostFileSystem.createFile('memfs:///new-file.txt')

  expect(execute).toHaveBeenCalledWith('Layout.handleWorkspaceRefresh', {
    changed: ['memfs:///new-file.txt'],
  })
  expect(execute).toHaveBeenCalledWith('Layout.refreshSourceControlBadgeCount')
})

test('writeFile - wrapped extension host uri', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(() => {})
  await ExtensionHostFileSystem.writeFile('extension-host://xyz:///test-folder', 'test')
  expect(ExtensionHostShared.executeProvider).toHaveBeenCalledTimes(1)
  expect(ExtensionHostShared.executeProvider).toHaveBeenCalledWith({
    event: 'onFileSystem:xyz',
    method: 'ExtensionHostFileSystem.writeFile',
    noProviderFoundMessage: 'no file system provider found',
    params: ['xyz', '/test-folder', 'test'],
  })
})

test('writeFile - error', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(ExtensionHostFileSystem.writeFile('memfs:///test-folder', 'test')).rejects.toThrow(new TypeError('x is not a function'))
  expect(execute).not.toHaveBeenCalled()
})

test('readDirWithFileTypes', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(async () => {
    return [
      {
        name: 'file 1',
        type: DirentType.File,
      },
      {
        name: 'file 2',
        type: DirentType.File,
      },
      {
        name: 'file 3',
        type: DirentType.File,
      },
    ]
  })
  expect(await ExtensionHostFileSystem.readDirWithFileTypes('memfs:///test-folder')).toEqual([
    {
      name: 'file 1',
      type: DirentType.File,
    },
    {
      name: 'file 2',
      type: DirentType.File,
    },
    {
      name: 'file 3',
      type: DirentType.File,
    },
  ])
})

test('readDirWithFileTypes - error', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(async () => {
    throw new TypeError('x is not a function')
  })
  await expect(ExtensionHostFileSystem.readDirWithFileTypes('memfs:///test-folder')).rejects.toThrow(new TypeError('x is not a function'))
})

test('isReadonly', async () => {
  // @ts-ignore
  ExtensionHostShared.executeProvider.mockImplementation(async () => {
    return true
  })
  expect(await ExtensionHostFileSystem.isReadonly('extension-host://xyz:///test-folder')).toBe(true)
  expect(ExtensionHostShared.executeProvider).toHaveBeenCalledTimes(1)
  expect(ExtensionHostShared.executeProvider).toHaveBeenCalledWith({
    event: 'onFileSystem:xyz',
    method: 'ExtensionHostFileSystem.isReadonly',
    noProviderFoundMessage: 'no file system provider found',
    params: ['xyz'],
  })
})

test('isolated provider dispatch uses full provider uris', async () => {
  invoke.mockImplementation(async (method) => ({
    found: true,
    result: method,
  }))

  await expect(ExtensionHostFileSystem.readFile('remote-ssh:///test-folder/README.md')).resolves.toBe('Extensions.executeFileSystemProviderReadFile')
  await expect(ExtensionHostFileSystem.readDirWithFileTypes('remote-ssh:///test-folder')).resolves.toBe(
    'Extensions.executeFileSystemProviderReadDirWithFileTypes',
  )
  await expect(ExtensionHostFileSystem.mkdir('remote-ssh:///test-folder/new-folder')).resolves.toBe('Extensions.executeFileSystemProviderMkdir')
  await expect(ExtensionHostFileSystem.writeFile('remote-ssh:///test-folder/new.txt', 'content')).resolves.toBe(
    'Extensions.executeFileSystemProviderWriteFile',
  )
  await expect(ExtensionHostFileSystem.rename('remote-ssh:///test-folder/new.txt', 'remote-ssh:///test-folder/renamed.txt')).resolves.toBe(
    'Extensions.executeFileSystemProviderRename',
  )
  await expect(ExtensionHostFileSystem.remove('remote-ssh:///test-folder/renamed.txt')).resolves.toBe('Extensions.executeFileSystemProviderRemove')
  await expect(ExtensionHostFileSystem.getPathSeparator('remote-ssh:///test-folder')).resolves.toBe(
    'Extensions.executeFileSystemProviderGetPathSeparator',
  )
  await expect(ExtensionHostFileSystem.isReadonly('remote-ssh:///test-folder')).resolves.toBe('Extensions.executeFileSystemProviderIsReadonly')

  expect(invoke.mock.calls).toEqual([
    ['Extensions.executeFileSystemProviderReadFile', 'remote-ssh', 'remote-ssh:///test-folder/README.md'],
    ['Extensions.executeFileSystemProviderReadDirWithFileTypes', 'remote-ssh', 'remote-ssh:///test-folder'],
    ['Extensions.executeFileSystemProviderMkdir', 'remote-ssh', 'remote-ssh:///test-folder/new-folder'],
    ['Extensions.executeFileSystemProviderWriteFile', 'remote-ssh', 'remote-ssh:///test-folder/new.txt', 'content'],
    ['Extensions.executeFileSystemProviderRename', 'remote-ssh', 'remote-ssh:///test-folder/new.txt', 'remote-ssh:///test-folder/renamed.txt'],
    ['Extensions.executeFileSystemProviderRemove', 'remote-ssh', 'remote-ssh:///test-folder/renamed.txt'],
    ['Extensions.executeFileSystemProviderGetPathSeparator', 'remote-ssh'],
    ['Extensions.executeFileSystemProviderIsReadonly', 'remote-ssh'],
  ])
  expect(ExtensionHostShared.executeProvider).not.toHaveBeenCalled()
})

test('isolated provider dispatch unwraps extension host uris', async () => {
  invoke.mockResolvedValue({
    found: true,
    result: 'content',
  })

  await expect(ExtensionHostFileSystem.readFile('extension-host://remote-ssh:///test-folder/README.md')).resolves.toBe('content')

  expect(invoke).toHaveBeenCalledWith('Extensions.executeFileSystemProviderReadFile', 'remote-ssh', 'remote-ssh:///test-folder/README.md')
})
