import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.js'
import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/FileSystem/FileSystem.js', () => {
  return {
    readFile: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

jest.unstable_mockModule(
  '../src/parts/OffscreenCanvas/OffscreenCanvas.js',
  () => {
    return {
      create: jest.fn(() => {
        throw new Error('not implemented')
      }),
    }
  }
)

jest.unstable_mockModule('../src/parts/PdfWorker/PdfWorker.js', () => {
  return {
    invoke: jest.fn(() => {
      throw new Error('not implemented')
    }),
    create() {
      return {
        sendCanvas() {},
        send() {},
      }
    },
  }
})

const ViewletPdf = await import('../src/parts/ViewletPdf/ViewletPdf.js')
const OffscreenCanvas = await import(
  '../src/parts/OffscreenCanvas/OffscreenCanvas.js'
)
const FileSystem = await import('../src/parts/FileSystem/FileSystem.js')

test('name', () => {
  expect(ViewletPdf.name).toBe(ViewletModuleId.Pdf)
})

test('create', () => {
  const state = ViewletPdf.create()
  expect(state).toBeDefined()
})

test('loadContent - error', async () => {
  // @ts-ignore
  FileSystem.readFile.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  const state = ViewletPdf.create()
  await expect(ViewletPdf.loadContent(state)).rejects.toThrowError(
    new TypeError('x is not a function')
  )
})

test('loadContent', async () => {
  // @ts-ignore
  FileSystem.readFile.mockImplementation(() => {
    return 'sample pdf content'
  })
  const state = ViewletPdf.create()
  expect(await ViewletPdf.loadContent(state)).toMatchObject({
    content: 'sample pdf content',
  })
})

test('previous', async () => {
  const state = { ...ViewletPdf.create(), page: 1 }
  expect(await ViewletPdf.previous(state)).toMatchObject({
    page: 0,
  })
})

test('next', async () => {
  const state = { ...ViewletPdf.create(), page: 0 }
  expect(await ViewletPdf.next(state)).toMatchObject({
    page: 1,
  })
})
