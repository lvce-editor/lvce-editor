import * as DomExceptionType from '../src/parts/DomExceptionType/DomExceptionType.js'
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

test('getChildHandles - error - not allowed', async () => {
  /**
   * @type {FileSystemDirectoryHandle}
   */
  const handle = {
    // @ts-ignore
    values() {
      throw new DOMException('The request is not allowed by the user agent or the platform in the current context.', DomExceptionType.NotAllowedError)
    },
  }
  await expect(FileSystemDirectoryHandle.getChildHandles(handle)).rejects.toThrowError(
    new Error(`The request is not allowed by the user agent or the platform in the current context.`)
  )
})
