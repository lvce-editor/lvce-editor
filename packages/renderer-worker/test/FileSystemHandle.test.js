import * as DirentType from '../src/parts/DirentType/DirentType.js'
import * as FileHandleType from '../src/parts/FileHandleType/FileHandleType.js'
import * as FileSystemHandle from '../src/parts/FileSystemHandle/FileSystemHandle.js'

test('getChildHandles', async () => {
  const handle = {
    values() {
      return {
        async *[Symbol.asyncIterator]() {
          yield {
            name: 'file-1.txt',
            kind: FileHandleType.File,
          }
          yield {
            name: 'folder-1',
            kind: FileHandleType.Directory,
          }
        },
      }
    },
  }
  expect(await FileSystemHandle.getChildHandles(handle)).toEqual([
    {
      name: 'file-1.txt',
      kind: FileHandleType.File,
    },
    {
      name: 'folder-1',
      kind: FileHandleType.Directory,
    },
  ])
})

test('getDirents', async () => {
  expect(
    await FileSystemHandle.getDirents([
      {
        name: 'file-1.txt',
        kind: FileHandleType.File,
      },
      {
        name: 'folder-1',
        kind: FileHandleType.Directory,
      },
    ])
  ).toEqual([
    {
      name: 'file-1.txt',
      type: DirentType.File,
    },
    {
      name: 'folder-1',
      type: DirentType.Directory,
    },
  ])
})
