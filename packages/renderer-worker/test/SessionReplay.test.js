import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
  jest.useFakeTimers().setSystemTime(new Date('2020-01-01'))
})

jest.unstable_mockModule('../src/parts/Download/Download.js', () => {
  return {
    downloadFile: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/IndexedDb/IndexedDb.js', () => {
  return {
    getValues: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const Download = await import('../src/parts/Download/Download.js')
const SessionReplay = await import(
  '../src/parts/SessionReplay/SessionReplay.js'
)
const IndexedDb = await import('../src/parts/IndexedDb/IndexedDb.js')

test('downloadSession - error with download', async () => {
  URL.createObjectURL = jest.fn(() => 'test://test-session.json')
  URL.revokeObjectURL = jest.fn()
  // @ts-ignore
  Download.downloadFile.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  // @ts-ignore
  IndexedDb.getValues.mockImplementation(() => {
    return []
  })
  await expect(SessionReplay.downloadSession()).rejects.toThrowError(
    new Error('Failed to download session')
  )
  expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1)
  expect(URL.revokeObjectURL).toHaveBeenCalledWith('test://test-session.json')
})

test('downloadSession', async () => {
  URL.createObjectURL = jest.fn(() => 'test://test-session.json')
  URL.revokeObjectURL = jest.fn()
  // @ts-ignore
  Download.downloadFile.mockImplementation(() => {})
  // @ts-ignore
  IndexedDb.getValues.mockImplementation(() => {
    return []
  })
  await SessionReplay.downloadSession()
  expect(Download.downloadFile).toHaveBeenCalledTimes(1)
  expect(Download.downloadFile).toHaveBeenCalledWith(
    'session-2020-01-01T00:00:00.000Z.json',
    'test://test-session.json'
  )
  expect(URL.revokeObjectURL).toHaveBeenCalledTimes(1)
  expect(URL.revokeObjectURL).toHaveBeenCalledWith('test://test-session.json')
})
