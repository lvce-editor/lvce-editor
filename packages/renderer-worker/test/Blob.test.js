/**
 * @jest-environment jsdom
 */

import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../../../static/js/blob-util.js', () => {
  return {
    base64StringToBlob: jest.fn(() => {
      throw new Error('not implemented')
    }),
    blobToBinaryString: jest.fn(() => {
      throw new Error('not implemented')
    }),
    binaryStringToBlob: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const Blob = await import('../src/parts/Blob/Blob.js')
const BlobUtil = await import('../../../static/js/blob-util.js')

test('base64StringToBlob', async () => {
  // @ts-ignore
  BlobUtil.base64StringToBlob.mockImplementation(() => {
    return new self.Blob([''])
  })
  expect(await Blob.base64StringToBlob('YWJj')).toBeInstanceOf(self.Blob)
})

test('blobToBinaryString - error - progress event', async () => {
  // @ts-ignore
  BlobUtil.blobToBinaryString.mockImplementation(() => {
    const error = new ProgressEvent('error', {})
    Object.defineProperty(error, 'target', {
      value: {
        // @ts-ignore
        error: new Error(
          'A requested file or directory could not be found at the time an operation was processed.'
        ),
      },
    })
    throw error
  })
  await expect(Blob.blobToBinaryString('YWJj')).rejects.toThrowError(
    new Error(
      'Failed to convert blob to binary string: Error: A requested file or directory could not be found at the time an operation was processed.'
    )
  )
})
