import { jest } from '@jest/globals'
import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.js'

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
        send() {},
        sendAndTransfer() {},
      }
    },
  }
})

jest.unstable_mockModule(
  '../src/parts/PdfWorkerFunctions/PdfWorkerFunctions.js',
  () => {
    return {
      setContent: () => {
        return {
          numberOfPages: 10,
        }
      },
      sendCanvas: jest.fn(),
      resize: jest.fn(),
      render: jest.fn(),
      focusPage: jest.fn(),
    }
  }
)

const ViewletPdf = await import('../src/parts/ViewletPdf/ViewletPdf.js')
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
