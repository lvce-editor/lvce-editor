import { beforeEach, expect, jest, test } from '@jest/globals'
import * as WellKnownDirectoryType from '../src/parts/WellKnownDirectoryType/WellKnownDirectoryType.js'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/FilePicker/FilePicker.js', () => {
  return {
    showSaveFilePicker: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})
jest.unstable_mockModule('../src/parts/FileSystemFileHandle/FileSystemFileHandle.js', () => {
  return {
    writeResponse: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/Ajax/Ajax.js', () => {
  return {
    getResponse: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const FilePicker = await import('../src/parts/FilePicker/FilePicker.js')
const Ajax = await import('../src/parts/Ajax/Ajax.js')
const SaveFileAs = await import('../src/parts/SaveFileAs/SaveFileAs.js')
const FileSystemFileHandle = await import('../src/parts/FileSystemFileHandle/FileSystemFileHandle.js')

class FileHandle {
  constructor() {
    this.name = 'fileHandle'
  }
}

class Response {
  constructor() {
    this.name = 'response'
  }
}

test('saveFileAs', async () => {
  // @ts-ignore
  FilePicker.showSaveFilePicker.mockImplementation(() => {
    return new FileHandle()
  })
  // @ts-ignore
  Ajax.getResponse.mockImplementation(() => {
    return new Response()
  })
  await SaveFileAs.saveFileAs('image.png', 'https://example.com/image.png')
  expect(FilePicker.showSaveFilePicker).toHaveBeenCalledTimes(1)
  expect(FilePicker.showSaveFilePicker).toHaveBeenCalledWith({
    suggestedName: 'image.png',
    startIn: WellKnownDirectoryType.Downloads,
    types: [
      {
        accept: {
          'image/png': ['.png'],
        },
        description: 'Text File',
      },
    ],
  })
  expect(Ajax.getResponse).toHaveBeenCalledTimes(1)
  expect(Ajax.getResponse).toHaveBeenCalledWith('https://example.com/image.png')
  expect(FileSystemFileHandle.writeResponse).toHaveBeenCalledTimes(1)
  // @ts-ignore
  expect(FileSystemFileHandle.writeResponse).toHaveBeenCalledWith(new FileHandle(), new Response())
})

test('saveFileAs - error', async () => {
  // @ts-ignore
  FilePicker.showSaveFilePicker.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  // @ts-ignore
  Ajax.getResponse.mockImplementation(() => {
    return new Response()
  })
  await expect(SaveFileAs.saveFileAs('image.png', 'https://example.com/image.png')).rejects.toThrow(
    new Error('Failed to save file: TypeError: x is not a function'),
  )
})

test('saveFileAs - error - not supported', async () => {
  // @ts-ignore
  FilePicker.showSaveFilePicker.mockImplementation(() => {
    throw new Error('showSaveFilePicker not supported on this browser')
  })
  // @ts-ignore
  Ajax.getResponse.mockImplementation(() => {
    return new Response()
  })
  await expect(SaveFileAs.saveFileAs('image.png', 'https://example.com/image.png')).rejects.toThrow(
    new Error('Failed to save file: showSaveFilePicker not supported on this browser'),
  )
})

test('saveFileAs - error - aborted', async () => {
  // @ts-ignore
  FilePicker.showSaveFilePicker.mockImplementation(() => {
    throw new DOMException('The user aborted a request.', 'AbortError')
  })
  // @ts-ignore
  Ajax.getResponse.mockImplementation(() => {
    return new Response()
  })
  await SaveFileAs.saveFileAs('image.png', 'https://example.com/image.png')
  expect(Ajax.getResponse).not.toHaveBeenCalled()
})
