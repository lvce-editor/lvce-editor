import * as FileHandleType from '../src/parts/FileHandleType/FileHandleType.js'
import * as FileSystemDirectoryHandle from '../src/parts/FileSystemDirectoryHandle/FileSystemDirectoryHandle.js'

test('getChildHandles', async () => {
  /**
   * @type {FileSystemDirectoryHandle}
   */
  const handle = {
    // @ts-ignore
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
  expect(await FileSystemDirectoryHandle.getChildHandles(handle)).toEqual([
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
