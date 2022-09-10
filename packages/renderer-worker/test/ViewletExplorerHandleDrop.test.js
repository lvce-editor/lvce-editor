import * as DirentType from '../src/parts/DirentType/DirentType.js'
import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.js', () => {
  return {
    copy: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const FileSystem = await import('../src/parts/FileSystem/FileSystem.js')
const ViewletExplorerHandleDrop = await import(
  '../src/parts/ViewletExplorer/ViewletExplorerHandleDrop.js'
)
const ViewletExplorer = await import(
  '../src/parts/ViewletExplorer/ViewletExplorer.js'
)

test('handleDrop', async () => {
  // @ts-ignore
  FileSystem.copy.mockImplementation(() => {})
  const state = {
    ...ViewletExplorer.create(),
    root: '/test',
    focusedIndex: 1,
    dirents: [],
    pathSeparator: '/',
  }
  expect(
    await ViewletExplorerHandleDrop.handleDrop(state, [
      {
        lastModified: 1662556917899,
        lastModifiedDate: new Date(),
        name: 'file.txt',
        path: '/source/file.txt',
        size: 4,
        type: 'text/plain',
        webkitRelativePath: '',
      },
    ])
  ).toMatchObject({
    dirents: [
      {
        path: '/test/file.txt',
      },
    ],
  })
  expect(FileSystem.copy).toHaveBeenCalledTimes(1)
  expect(FileSystem.copy).toHaveBeenCalledWith(
    '/source/file.txt',
    '/test/file.txt'
  )
})

test('handleDrop - error', async () => {
  // @ts-ignore
  FileSystem.copy.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  const state = {
    root: '/test',
    focusedIndex: 1,
    dirents: [],
  }
  await expect(
    ViewletExplorerHandleDrop.handleDrop(state, [
      {
        lastModified: 1662556917899,
        lastModifiedDate: new Date(),
        name: 'file.txt',
        path: '/test/file.txt',
        size: 4,
        type: 'text/plain',
        webkitRelativePath: '',
      },
    ])
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
