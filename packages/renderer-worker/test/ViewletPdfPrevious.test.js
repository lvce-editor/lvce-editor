import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/ViewletPdf/ViewletPdfFocusPage.js',
  () => {
    return {
      focusPage(state, pageNumber) {
        return {
          ...state,
          pageNumber,
        }
      },
    }
  }
)

const ViewletPdf = await import('../src/parts/ViewletPdf/ViewletPdf.js')
const ViewletPdfPrevious = await import(
  '../src/parts/ViewletPdf/ViewletPdfPrevious.js'
)

test('previous', async () => {
  const state = { ...ViewletPdf.create(), page: 1 }
  expect(await ViewletPdfPrevious.previous(state)).toMatchObject({
    page: 0,
  })
})
