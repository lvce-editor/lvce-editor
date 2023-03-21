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
const MeasureTextWidth = await import('../src/parts/MeasureTextWidth/MeasureTextWidth.js')
const MeasureLongestLineWidth = await import('../src/parts/MeasureLongestLineWidth/MeasureLongestLineWidth.js')

test('measureLongestLineWidth', () => {
  // @ts-ignore
  MeasureTextWidth.measureTextWidth.mockImplementation(() => {
    return 16
  })
  const lines = ['test']
  const fontWeight = 400
  const fontSize = 15
  const fontFamily = 'Test Font'
  const letterSpacing = 0.5
  expect(MeasureLongestLineWidth.measureLongestLineWidth(lines, fontWeight, fontSize, fontFamily, letterSpacing)).toBe(16)
  expect(MeasureTextWidth.measureTextWidth).toHaveBeenCalledTimes(1)
  expect(MeasureTextWidth.measureTextWidth).toHaveBeenCalledWith('test', 400, 15, 'Test Font', 0.5)
})
