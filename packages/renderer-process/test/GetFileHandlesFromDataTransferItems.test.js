/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/Platform/Platform.js', () => {
  return {
    getBrowser: jest.fn(),
  }
})

const GetFileHandlesFromDataTransferItems = await import('../src/parts/GetFileHandlesFromDataTransferItems/GetFileHandlesFromDataTransferItems.js')
const Platform = await import('../src/parts/Platform/Platform.js')

test('getFileHandles - error - not supported on firefox', async () => {
  // @ts-ignore
  Platform.getBrowser.mockImplementation(() => {
    return 'firefox'
  })
  const items = [
    {
      getAsFileSystemHandle() {
        throw new TypeError(`item.getAsFileSystemHandle is not a function`)
      },
    },
  ]
  await expect(GetFileHandlesFromDataTransferItems.getFileHandles(items)).rejects.toThrowError(
    new Error('The File System Access Api is not supported on Firefox')
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
