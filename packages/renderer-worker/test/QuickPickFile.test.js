import { jest } from '@jest/globals'
import { Command } from '../src/parts/TestFrameWorkComponent/TestFrameWorkComponent.js'

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

const QuickPickFile = await import('../src/parts/QuickPick/QuickPickFile.js')
const SearchFile = await import('../src/parts/SearchFile/SearchFile.js')
const IconTheme = await import('../src/parts/IconTheme/IconTheme.js')

test('name', () => {
  expect(QuickPickFile.name).toBe('file')
})

test('getPlaceholder', () => {
  expect(QuickPickFile.getPlaceholder()).toBe('')
})

test('getHelpEntries', () => {
  expect(QuickPickFile.getHelpEntries()).toEqual([
    {
      category: 'global commands',
      description: 'Go to file',
    },
  ])
})

test('getNoResults', () => {
  expect(QuickPickFile.getNoResults()).toEqual({
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
  expect(await QuickPickFile.getPicks('/test/file.txt')).toEqual([
    {
      icon: '_file',
      label: '/test/file-1.txt',
    },
    {
      icon: '_file',
      label: '/test/file-2.txt',
    },
    {
      icon: '_file',
      label: '/test/file-3.txt',
    },
  ])
  expect(SearchFile.searchFile).toHaveBeenCalledTimes(1)
  expect(SearchFile.searchFile).toHaveBeenCalledWith('/test', '/test/file.txt')
  expect(IconTheme.getFileIcon).toHaveBeenCalledTimes(3)
  expect(IconTheme.getFileIcon).toHaveBeenNthCalledWith(1, {
    name: 'file-1.txt',
  })
})

test('getPicks - empty', async () => {
  // @ts-ignore
  SearchFile.searchFile.mockImplementation(() => {
    return []
  })
  expect(await QuickPickFile.getPicks('/test/file.txt')).toEqual([])
})

test('getPicks - error', async () => {
  // @ts-ignore
  SearchFile.searchFile.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(QuickPickFile.getPicks('/test/file.txt')).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test.skip('selectPick', async () => {
  // @ts-ignore
  Command.execute.mockImplementation(() => {})
  expect(
    await QuickPickFile.selectPick({
      label: 'test-file-1.txt',
    })
  ).toEqual({
    command: 'hide',
  })
  expect(Command.execute).toHaveBeenCalledTimes(1)
  expect(Command.execute).toHaveBeenCalledWith(
    'Main.openUri',
    'test-file-1.txt'
  )
})
