import { expect, test } from '@jest/globals'
import * as DomExceptionType from '../src/parts/DomExceptionType/DomExceptionType.js'
import * as FileHandleType from '../src/parts/FileHandleType/FileHandleType.js'
import * as FileSystemDirectoryHandle from '../src/parts/FileSystemDirectoryHandle/FileSystemDirectoryHandle.js'

test('getChildHandles', async () => {
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
  } as any
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
  const handle = {
    // @ts-ignore
    values() {
      throw new DOMException('The request is not allowed by the user agent or the platform in the current context.', DomExceptionType.NotAllowedError)
    },
  } as any
  await expect(FileSystemDirectoryHandle.getChildHandles(handle)).rejects.toThrow(
    new Error('The request is not allowed by the user agent or the platform in the current context.'),
  )
})
