/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/IsFirefox/IsFirefox.ts', () => {
  return {
    isFirefox: jest.fn(),
  }
})

const GetFileHandlesFromDataTransferItems = await import('../src/parts/GetFileHandlesFromDataTransferItems/GetFileHandlesFromDataTransferItems.ts')
const IsFirefox = await import('../src/parts/IsFirefox/IsFirefox.ts')

test('getFileHandles - error - not supported on firefox', async () => {
  // @ts-ignore
  IsFirefox.isFirefox.mockImplementation(() => {
    return true
  })
  const items = [
    {
      getAsFileSystemHandle() {
        throw new TypeError(`item.getAsFileSystemHandle is not a function`)
      },
    },
  ]
  await expect(GetFileHandlesFromDataTransferItems.getFileHandles(items)).rejects.toThrow(
    new Error('The File System Access Api is not supported on Firefox'),
  )
})

test('getFileHandles - error - not supported on firefox', async () => {
  const items = [
    {
      getAsFileSystemHandle() {
        return {
          __type: 'FileSystemFileHandle',
        }
      },
    },
  ]
  expect(await GetFileHandlesFromDataTransferItems.getFileHandles(items)).toEqual([
    {
      __type: 'FileSystemFileHandle',
    },
  ])
})
