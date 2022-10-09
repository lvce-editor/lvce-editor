import * as DirentType from '../src/parts/DirentType/DirentType.js'
import * as FileHandleType from '../src/parts/FileHandleType/FileHandleType.js'
import * as FileSystemHandle from '../src/parts/FileSystemHandle/FileSystemHandle.js'

test('getDirents', async () => {
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
  expect(await FileSystemHandle.getDirents(handle)).toEqual([
    {
      type: DirentType.File,
      name: 'file-1.txt',
    },
    {
      type: DirentType.Directory,
      name: 'folder-1',
    },
  ])
})
