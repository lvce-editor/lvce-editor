/**
 * @jest-environment jsdom
 */
import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule(
  '../src/parts/RendererWorker/RendererWorker.js',
  () => {
    return {
      send: jest.fn(() => {}),
    }
  }
)

const RendererWorker = await import(
  '../src/parts/RendererWorker/RendererWorker.js'
)

const ViewletPdf = await import('../src/parts/ViewletPdf/ViewletPdf.js')

test('event - click - previous', () => {
  const state = ViewletPdf.create()
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  })
  const { $ButtonPreviousPage } = state
  $ButtonPreviousPage.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith('Pdf.previous')
})

test('event - click - next', () => {
  const state = ViewletPdf.create()
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  })
  const { $ButtonNextPage } = state
  $ButtonNextPage.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith('Pdf.next')
})

test('event - click - zoom in', () => {
  const state = ViewletPdf.create()
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  })
  const { $ButtonZoomIn } = state
  $ButtonZoomIn.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith('Pdf.zoomIn')
})

test('event - click - zoom out', () => {
  const state = ViewletPdf.create()
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  })
  const { $ButtonZoomOut } = state
  $ButtonZoomOut.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith('Pdf.zoomOut')
})

test('event - click - print', () => {
  const state = ViewletPdf.create()
  const event = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  })
  const { $ButtonPrint } = state
  $ButtonPrint.dispatchEvent(event)
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith('Pdf.print')
})
