import * as OffscreenCanvas from '../src/parts/OffscreenCanvas/OffscreenCanvas.js'

beforeEach(() => {
  OffscreenCanvas.reset()
})

test.skip('add', () => {
  OffscreenCanvas.add(1, { offscreenCanvasPlaceholder: true })
  expect(OffscreenCanvas.all()).toEqual({
    1: {
      offscreenCanvasPlaceholder: true,
    },
  })
})

test.skip('remove', () => {
  OffscreenCanvas.add(1, { offscreenCanvasPlaceholder: true })
  OffscreenCanvas.remove(1)
  expect(OffscreenCanvas.all()).toEqual({})
})

test.skip('keys', () => {
  OffscreenCanvas.add(1, { offscreenCanvasPlaceholder: true })
  expect(OffscreenCanvas.keys()).toEqual(['1'])
})

test.skip('values', () => {
  OffscreenCanvas.add(1, { offscreenCanvasPlaceholder: true })
  expect(OffscreenCanvas.values()).toEqual([
    {
      offscreenCanvasPlaceholder: true,
    },
  ])
})
