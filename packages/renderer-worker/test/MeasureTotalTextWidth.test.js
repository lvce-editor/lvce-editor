import { jest } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/MeasureTextWidth/MeasureTextWidth.js', () => {
  return {
    measureTextWidth: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const MeasureTotalTextWidth = await import('../src/parts/MeasureTotalTextWidth/MeasureTotalTextWIdth.js')
const MeasureTextWidth = await import('../src/parts/MeasureTextWidth/MeasureTextWidth.js')

test('measureTotalTextWidth', () => {
  // @ts-ignore
  MeasureTextWidth.measureTextWidth.mockImplementation(() => {
    return 10
  })
  const items = ['a', 'b', 'c']
  const fontWeight = 400
  const fontSize = 10
  const fontFamily = 'sans-serif'
  const letterSpacing = 0
  expect(MeasureTotalTextWidth.measureTotalTextWidth(items, fontWeight, fontSize, fontFamily, letterSpacing)).toBe(30)
  expect(MeasureTextWidth.measureTextWidth).toHaveBeenCalledTimes(3)
  expect(MeasureTextWidth.measureTextWidth).toHaveBeenNthCalledWith(1, 'a', 400, 10, 'sans-serif', 0)
  expect(MeasureTextWidth.measureTextWidth).toHaveBeenNthCalledWith(2, 'b', 400, 10, 'sans-serif', 0)
  expect(MeasureTextWidth.measureTextWidth).toHaveBeenNthCalledWith(3, 'c', 400, 10, 'sans-serif', 0)
})
