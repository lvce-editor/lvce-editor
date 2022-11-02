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
const ViewletPdfNext = await import('../src/parts/ViewletPdf/ViewletPdfNext.js')

test('previous', async () => {
  const state = { ...ViewletPdf.create(), page: 0, numberOfPages: 5 }
  expect(await ViewletPdfNext.next(state)).toMatchObject({
    page: 1,
  })
})
