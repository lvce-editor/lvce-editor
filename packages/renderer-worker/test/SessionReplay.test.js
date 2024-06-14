import { beforeAll, beforeEach, expect, jest, test } from '@jest/globals'
import * as ModuleId from '../src/parts/ModuleId/ModuleId.js'

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
const SessionReplay = await import('../src/parts/SessionReplay/SessionReplay.js')
const IndexedDb = await import('../src/parts/IndexedDb/IndexedDb.js')
const Command = await import('../src/parts/Command/Command.js')

beforeAll(() => {
  Command.setLoad((moduleId) => {
    switch (moduleId) {
      case ModuleId.Download:
        return import('../src/parts/Download/Download.ipc.js')
      default:
        throw new Error(`module not found ${moduleId}`)
    }
  })
})

test('downloadSession - error with download', async () => {
  // @ts-ignore
  Download.downloadJson.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  // @ts-ignore
  IndexedDb.getValuesByIndexName.mockImplementation(() => {
    return []
  })
  await expect(SessionReplay.downloadSession()).rejects.toThrow(new Error('Failed to download session: TypeError: x is not a function'))
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
  expect(Download.downloadJson).toHaveBeenCalledWith([], 'session-2020-01-01T00:00:00.000Z.json')
})

test('getEvents - error with indexeddb', async () => {
  // @ts-ignore
  IndexedDb.getValuesByIndexName.mockImplementation(() => {
    throw new DOMException("Failed to execute 'index' on 'IDBObjectStore': The specified index was not found.")
  })
  await expect(SessionReplay.getEvents('')).rejects.toThrow(
    new Error("failed to get session replay events: DOMException: Failed to execute 'index' on 'IDBObjectStore': The specified index was not found."),
  )
})

test('getEvents', async () => {
  // @ts-ignore
  IndexedDb.getValuesByIndexName.mockImplementation(() => {
    return []
  })
  expect(await SessionReplay.getEvents('test')).toEqual([])
  expect(IndexedDb.getValuesByIndexName).toHaveBeenCalledTimes(1)
  expect(IndexedDb.getValuesByIndexName).toHaveBeenCalledWith('session', 'sessionId', 'test')
})
