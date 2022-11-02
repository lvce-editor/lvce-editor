import * as OffscreenCanvas from '../src/parts/OffscreenCanvas/OffscreenCanvas.js'

beforeEach(() => {
  OffscreenCanvas.reset()
})

test('add', () => {
  OffscreenCanvas.add(1, { offscreenCanvasPlaceholder: true })
  expect(OffscreenCanvas.all()).toEqual({
    1: {
      offscreenCanvasPlaceholder: true,
    },
  })
})

test('remove', () => {
  OffscreenCanvas.add(1, { offscreenCanvasPlaceholder: true })
  OffscreenCanvas.remove(1)
  expect(OffscreenCanvas.all()).toEqual({})
})

test('keys', () => {
  OffscreenCanvas.add(1, { offscreenCanvasPlaceholder: true })
  expect(OffscreenCanvas.keys()).toEqual(['1'])
})

test('values', () => {
  OffscreenCanvas.add(1, { offscreenCanvasPlaceholder: true })
  expect(OffscreenCanvas.values()).toEqual([
    {
      offscreenCanvasPlaceholder: true,
    },
  ])
})
