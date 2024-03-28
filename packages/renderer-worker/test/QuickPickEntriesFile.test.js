import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/SearchFile/SearchFile.js', () => {
  return {
    searchFile: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/Command/Command.js', () => {
  return {
    execute: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/IconTheme/IconTheme.js', () => {
  return {
    getFileIcon: jest.fn(),
  }
})

jest.unstable_mockModule('../src/parts/Workspace/Workspace.js', () => {
  return {
    state: {
      workspacePath: '/test',
    },
    pathBaseName(path) {
      return path.slice(path.lastIndexOf('/') + 1)
    },
  }
})

const QuickPickEntriesFile = await import('../src/parts/QuickPickEntriesFile/QuickPickEntriesFile.js')
const SearchFile = await import('../src/parts/SearchFile/SearchFile.js')
const IconTheme = await import('../src/parts/IconTheme/IconTheme.js')

test('name', () => {
  expect(QuickPickEntriesFile.name).toBe('file')
})

test('getPlaceholder', () => {
  expect(QuickPickEntriesFile.getPlaceholder()).toBe('')
})

test('getHelpEntries', () => {
  expect(QuickPickEntriesFile.getHelpEntries()).toEqual([
    {
      category: 'global commands',
      description: 'Go to file',
    },
  ])
})

test('getNoResults', () => {
  expect(QuickPickEntriesFile.getNoResults()).toEqual({
    label: 'No matching results',
  })
})

test('getPicks', async () => {
  // @ts-ignore
  SearchFile.searchFile.mockImplementation(() => {
    return ['/test/file-1.txt', '/test/file-2.txt', '/test/file-3.txt']
  })
  // @ts-ignore
  IconTheme.getFileIcon.mockImplementation(() => {
    return '_file'
  })
  expect(await QuickPickEntriesFile.getPicks('/test/file.txt')).toEqual(['/test/file-1.txt', '/test/file-2.txt', '/test/file-3.txt'])
  expect(SearchFile.searchFile).toHaveBeenCalledTimes(1)
  expect(SearchFile.searchFile).toHaveBeenCalledWith('/test', '/test/file.txt')
})

test('getPicks - empty', async () => {
  // @ts-ignore
  SearchFile.searchFile.mockImplementation(() => {
    return []
  })
  expect(await QuickPickEntriesFile.getPicks('/test/file.txt')).toEqual([])
})

test('getPicks - error', async () => {
  // @ts-ignore
  SearchFile.searchFile.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(QuickPickEntriesFile.getPicks('/test/file.txt')).rejects.toThrow(new TypeError('x is not a function'))
})
