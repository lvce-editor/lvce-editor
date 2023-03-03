import { jest } from '@jest/globals'
import * as DirentType from '../src/parts/DirentType/DirentType.js'
import * as ExplorerEditingType from '../src/parts/ExplorerEditingType/ExplorerEditingType.js'
import * as PathSeparatorType from '../src/parts/PathSeparatorType/PathSeparatorType.js'

beforeEach(() => {
  jest.resetAllMocks()
  GlobalEventBus.state.listenerMap = Object.create(null)
})

jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.js', () => {
  return {
    setState: jest.fn(() => {
      throw new Error('not implemented')
    }),
    getState: jest.fn(() => {
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
jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.js', () => {
  return {
    rename: jest.fn(() => {
      throw new Error('not implemented')
    }),
    writeFile: jest.fn(() => {
      throw new Error('not implemented')
    }),
    copy: jest.fn(() => {
      throw new Error('not implemented')
    }),
    remove: jest.fn(() => {
      throw new Error('not implemented')
    }),
    readDirWithFileTypes: jest.fn(() => {
      throw new Error('not implemented')
    }),
    getPathSeparator: () => {
      return '/'
    },
    getRealPath: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const ViewletExplorer = await import('../src/parts/ViewletExplorer/ViewletExplorer.js')
const ViewletExplorerAcceptEdit = await import('../src/parts/ViewletExplorer/ViewletExplorerAcceptEdit.js')
const GlobalEventBus = await import('../src/parts/GlobalEventBus/GlobalEventBus.js')
const FileSystem = await import('../src/parts/FileSystem/FileSystem.js')

test('acceptEdit - rename', async () => {
  // @ts-ignore
  FileSystem.rename.mockImplementation(() => {})
  const state = {
    ...ViewletExplorer.create(),
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 1,
    maxLineY: 2,
    root: '/test',
    pathSeparator: PathSeparatorType.Slash,
    items: [
      {
        depth: 1,
        icon: '',
        name: 'a.txt',
        path: '/test/a.txt',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ],
    editingIndex: 0,
    editingType: ExplorerEditingType.Rename,
    editingValue: 'b.txt',
  }
  expect(await ViewletExplorerAcceptEdit.acceptEdit(state)).toMatchObject({
    items: [
      {
        depth: 1,
        icon: '',
        name: 'b.txt',
        path: '/test/b.txt',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ],
  })
  expect(FileSystem.rename).toHaveBeenCalledTimes(1)
  expect(FileSystem.rename).toHaveBeenCalledWith('/test/a.txt', '/test/b.txt')
})

test('acceptEdit - rename - nested file', async () => {
  // @ts-ignore
  FileSystem.rename.mockImplementation(() => {})
  const state = {
    ...ViewletExplorer.create(),
    focusedIndex: 0,
    top: 0,
    height: 600,
    deltaY: 0,
    minLineY: 1,
    maxLineY: 2,
    root: '/test',
    pathSeparator: PathSeparatorType.Slash,
    items: [
      {
        depth: 1,
        icon: '',
        name: 'a',
        path: '/test/a',
        posInSet: 1,
        setSize: 1,
        type: DirentType.Directory,
      },
      {
        depth: 2,
        icon: '',
        name: 'b.txt',
        path: '/test/a/b.txt',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ],
    editingIndex: 1,
    editingType: ExplorerEditingType.Rename,
    editingValue: 'c.txt',
  }
  expect(await ViewletExplorerAcceptEdit.acceptEdit(state)).toMatchObject({
    items: [
      {
        depth: 1,
        icon: '',
        name: 'a',
        path: '/test/a',
        posInSet: 1,
        setSize: 1,
        type: DirentType.Directory,
      },
      {
        depth: 2,
        icon: '',
        name: 'c.txt',
        path: '/test/a/c.txt',
        posInSet: 1,
        setSize: 1,
        type: DirentType.File,
      },
    ],
    focusedIndex: 1,
  })
})
