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
    downloadJson: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule('../src/parts/IndexedDb/IndexedDb.js', () => {
  return {
    getValuesByIndexName: jest.fn(() => {
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
  // @ts-ignore
  Download.downloadJson.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  // @ts-ignore
  IndexedDb.getValuesByIndexName.mockImplementation(() => {
    return []
  })
  await expect(SessionReplay.downloadSession()).rejects.toThrowError(
    new Error('Failed to download session')
  )
})

test('downloadSession', async () => {
  // @ts-ignore
  Download.downloadJson.mockImplementation(() => {})
  // @ts-ignore
  IndexedDb.getValuesByIndexName.mockImplementation(() => {
    return []
  })
  await SessionReplay.downloadSession()
  expect(Download.downloadJson).toHaveBeenCalledTimes(1)
  expect(Download.downloadJson).toHaveBeenCalledWith(
    [],
    'session-2020-01-01T00:00:00.000Z.json'
  )
})
