import { beforeEach, expect, jest, test } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.js'
import { FileNotFoundError } from '../src/parts/FileNotFoundError/FileNotFoundError.js'

const getExtensions = jest.fn(async () => [
  {
    commands: [
      { id: 'sample.visible', label: 'Sample: Visible' },
      { id: 'sample.internal', internal: true },
    ],
  },
  {
    commands: [{ id: 'sample.disabled', label: 'Sample: Disabled' }],
    disabled: true,
  },
])

jest.unstable_mockModule('../src/parts/ExtensionMeta/ExtensionMeta.js', () => ({
  getExtensions,
}))

const invoke = jest
  .fn<(...args: readonly any[]) => Promise<any>>()
  .mockResolvedValue([{ commands: [{ id: 'source.command', label: 'Source Command' }] }])
jest.unstable_mockModule('../src/parts/ExtensionManagementWorker/ExtensionManagementWorker.js', () => ({ invoke }))

const readDirWithFileTypes = jest.fn<(...args: readonly any[]) => Promise<readonly any[]>>()
const readFile = jest.fn<(...args: readonly any[]) => Promise<string>>()
jest.unstable_mockModule('../src/parts/FileSystem/FileSystemHtml.js', () => ({
  readDirWithFileTypes,
  readFile,
}))

const ExtensionHostCommands = await import('../src/parts/ExtensionHost/ExtensionHostCommands.js')

beforeEach(() => {
  jest.clearAllMocks()
})

test('omits internal and disabled extension commands from the command palette', async () => {
  await expect(ExtensionHostCommands.getCommands('', 1)).resolves.toEqual([{ id: 'sample.visible', label: 'Sample: Visible' }])
})

test('queries only the requested application for extension commands', async () => {
  await expect(ExtensionHostCommands.getCommands('/static', 1, 'source')).resolves.toEqual([{ id: 'source.command', label: 'Source Command' }])
  expect(invoke).toHaveBeenCalledWith('Extensions.invokeForApplication', 'source', 'Extensions.getAllExtensions', '/static', 1)
})

test('file quickpick prunes directories ignored by the workspace root gitignore', async () => {
  readFile.mockResolvedValue('custom-cache/\n')
  readDirWithFileTypes.mockImplementation(async (uri) => {
    if (uri === 'html:///workspace') {
      return [
        { name: 'custom-cache', type: DirentType.Directory },
        { name: 'src', type: DirentType.Directory },
      ]
    }
    if (uri === 'html:///workspace/src') {
      return [{ name: 'main.ts', type: DirentType.File }]
    }
    throw new Error(`unexpected directory enumeration: ${uri}`)
  })

  await expect(ExtensionHostCommands.searchFileWithHtml('html:///workspace')).resolves.toEqual(['src/main.ts'])
  expect(readDirWithFileTypes).toHaveBeenCalledTimes(2)
  expect(readDirWithFileTypes).not.toHaveBeenCalledWith('html:///workspace/custom-cache')
})

test('file quickpick keeps searching when the workspace has no gitignore', async () => {
  readFile.mockRejectedValue(new FileNotFoundError('html:///workspace/.gitignore'))
  readDirWithFileTypes.mockResolvedValue([{ name: 'main.ts', type: DirentType.File }])

  await expect(ExtensionHostCommands.searchFileWithHtml('html:///workspace')).resolves.toEqual(['main.ts'])
  expect(readDirWithFileTypes).toHaveBeenCalledTimes(1)
})

test('file quickpick honors gitignore negations', async () => {
  readFile.mockResolvedValue('generated/*\n!generated/keep.ts\n')
  readDirWithFileTypes.mockImplementation(async (uri) => {
    if (uri === 'html:///workspace') {
      return [{ name: 'generated', type: DirentType.Directory }]
    }
    return [
      { name: 'drop.ts', type: DirentType.File },
      { name: 'keep.ts', type: DirentType.File },
    ]
  })

  await expect(ExtensionHostCommands.searchFileWithHtml('html:///workspace')).resolves.toEqual(['generated/keep.ts'])
  expect(readDirWithFileTypes).toHaveBeenCalledWith('html:///workspace/generated')
})
