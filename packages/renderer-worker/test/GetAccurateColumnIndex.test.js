import { jest, beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

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

const GetAccurateColumnIndex = await import('../src/parts/GetAccurateColumnIndex/GetAccurateColumnIndex.js')
const MeasureTextWidth = await import('../src/parts/MeasureTextWidth/MeasureTextWidth.js')

test('getAccurateColumnIndex - at start of line', () => {
  const line = ''
  const fontWeight = 400
  const fontSize = 15
  const fontFamily = 'Test'
  const letterSpacing = 0.5
  const isMonospaceFont = false
  const charWidth = 9
  const tabSize = 2
  const eventX = 0
  // @ts-ignore
  MeasureTextWidth.measureTextWidth.mockImplementation((text) => {
    switch (text) {
      case 'a':
        return 9
      default:
        return 0
    }
  })
  expect(
    GetAccurateColumnIndex.getAccurateColumnIndex(line, fontWeight, fontSize, fontFamily, letterSpacing, isMonospaceFont, charWidth, tabSize, eventX),
  ).toBe(0)
})

test('getAccurateColumnIndex - match exactly after first letter', () => {
  const line = 'b'
  const fontWeight = 400
  const fontSize = 15
  const fontFamily = 'Test'
  const letterSpacing = 0.5
  const isMonospaceFont = false
  const charWidth = 9
  const tabSize = 2
  const eventX = 0
  // @ts-ignore
  MeasureTextWidth.measureTextWidth.mockImplementation((text) => {
    switch (text) {
      case 'a':
        return 9
      case 'b':
        return 9
      default:
        return 0
    }
  })
  expect(
    GetAccurateColumnIndex.getAccurateColumnIndex(line, fontWeight, fontSize, fontFamily, letterSpacing, isMonospaceFont, charWidth, tabSize, eventX),
  ).toBe(0)
})

test('getAccurateColumnIndex - before first letter', () => {
  const line = 'b'
  const fontWeight = 400
  const fontSize = 15
  const fontFamily = 'Test'
  const letterSpacing = 0.5
  const isMonospaceFont = false
  const charWidth = 9
  const tabSize = 2
  const eventX = 3
  // @ts-ignore
  MeasureTextWidth.measureTextWidth.mockImplementation((text) => {
    switch (text) {
      case 'a':
        return 9
      case 'b':
        return 9
      default:
        return 0
    }
  })
  expect(
    GetAccurateColumnIndex.getAccurateColumnIndex(line, fontWeight, fontSize, fontFamily, letterSpacing, isMonospaceFont, charWidth, tabSize, eventX),
  ).toBe(0)
})

test('getAccurateColumnIndex - almost at first letter', () => {
  const line = 'b'
  const fontWeight = 400
  const fontSize = 15
  const fontFamily = 'Test'
  const letterSpacing = 0.5
  const isMonospaceFont = false
  const charWidth = 9
  const tabSize = 2
  const eventX = 7
  // @ts-ignore
  MeasureTextWidth.measureTextWidth.mockImplementation((text) => {
    switch (text) {
      case 'a':
        return 9
      case 'b':
        return 9
      default:
        return 0
    }
  })
  expect(
    GetAccurateColumnIndex.getAccurateColumnIndex(line, fontWeight, fontSize, fontFamily, letterSpacing, isMonospaceFont, charWidth, tabSize, eventX),
  ).toBe(1)
})

test('getAccurateColumnIndex - almost at second letter', () => {
  const line = 'bc'
  const fontWeight = 400
  const fontSize = 15
  const fontFamily = 'Test'
  const letterSpacing = 0.5
  const isMonospaceFont = false
  const charWidth = 9
  const tabSize = 2
  const eventX = 16
  // @ts-ignore
  MeasureTextWidth.measureTextWidth.mockImplementation((text) => {
    switch (text) {
      case 'a':
        return 9
      case 'b':
        return 9
      case 'c':
        return 9
      case 'bc':
        return 18
      default:
        return 0
    }
  })
  expect(
    GetAccurateColumnIndex.getAccurateColumnIndex(line, fontWeight, fontSize, fontFamily, letterSpacing, isMonospaceFont, charWidth, tabSize, eventX),
  ).toBe(2)
})

test('getAccurateColumnIndex - at second letter', () => {
  const line = 'bc'
  const fontWeight = 400
  const fontSize = 15
  const fontFamily = 'Test'
  const letterSpacing = 0.5
  const isMonospaceFont = false
  const charWidth = 9
  const tabSize = 2
  const eventX = 18
  // @ts-ignore
  MeasureTextWidth.measureTextWidth.mockImplementation((text) => {
    switch (text) {
      case 'a':
        return 9
      case 'b':
        return 9
      case 'c':
        return 9
      default:
        return 0
    }
  })
  expect(
    GetAccurateColumnIndex.getAccurateColumnIndex(line, fontWeight, fontSize, fontFamily, letterSpacing, isMonospaceFont, charWidth, tabSize, eventX),
  ).toBe(2)
})

test('getAccurateColumnIndex - emoji', () => {
  const line = '👮🏽‍♀️👮🏽‍♀️👮🏽‍♀️👮🏽‍♀️👮🏽‍♀️'
  const fontWeight = 400
  const fontSize = 15
  const fontFamily = 'Test'
  const letterSpacing = 0.5
  const tabSize = 2
  const eventX = 80
  const isMonospaceFont = false
  const charWidth = 9
  // @ts-ignore
  MeasureTextWidth.measureTextWidth.mockImplementation((text) => {
    switch (text) {
      case 'a':
        return 9
      case 'b':
        return 9
      case 'c':
        return 9
      case '👮🏽‍♀️':
        return 19
      case '👮🏽‍♀️👮🏽‍♀️':
        return 38
      case '👮🏽‍♀️👮🏽‍♀️👮🏽‍♀️':
        return 57
      case '👮🏽‍♀️👮🏽‍♀️👮🏽‍♀️👮🏽‍♀️':
        return 78
      default:
        return 0
    }
  })
  expect(
    GetAccurateColumnIndex.getAccurateColumnIndex(line, fontWeight, fontSize, fontFamily, letterSpacing, isMonospaceFont, charWidth, tabSize, eventX),
  ).toBe('👮🏽‍♀️'.length * 4)
})

test('getAccurateColumnIndex - normalize tab', () => {
  const line = '\ttest'
  const fontWeight = 400
  const fontSize = 15
  const fontFamily = 'Test'
  const letterSpacing = 0.5
  const isMonospaceFont = false
  const charWidth = 9
  const tabSize = 2
  const eventX = 45
  // @ts-ignore
  MeasureTextWidth.measureTextWidth.mockImplementation((text) => {
    switch (text) {
      case 'a':
        return 9
      case '  tes':
        return 45
      default:
        return 0
    }
  })
  expect(
    GetAccurateColumnIndex.getAccurateColumnIndex(line, fontWeight, fontSize, fontFamily, letterSpacing, isMonospaceFont, charWidth, tabSize, eventX),
  ).toBe(4)
  expect(MeasureTextWidth.measureTextWidth).toHaveBeenCalledTimes(1)
  expect(MeasureTextWidth.measureTextWidth).toHaveBeenNthCalledWith(1, '  tes', 400, 15, 'Test', 0.5, false, 9)
})

test('getAccurateColumnIndex - line starting with tab', () => {
  const line = '\ttry'
  const fontWeight = 400
  const fontSize = 15
  const fontFamily = 'Test'
  const letterSpacing = 0.5
  const isMonospaceFont = false
  const charWidth = 9.73080444
  const tabSize = 2
  const eventX = 50
  // @ts-ignore
  MeasureTextWidth.measureTextWidth.mockImplementation((text) => {
    switch (text) {
      case '  try {':
        return 9
      case '  tes':
        return 45
      default:
        return 0
    }
  })
  expect(
    GetAccurateColumnIndex.getAccurateColumnIndex(line, fontWeight, fontSize, fontFamily, letterSpacing, isMonospaceFont, charWidth, tabSize, eventX),
  ).toBe(4)
  expect(MeasureTextWidth.measureTextWidth).toHaveBeenCalledTimes(1)
  expect(MeasureTextWidth.measureTextWidth).toHaveBeenNthCalledWith(1, '  try', 400, 15, 'Test', 0.5, false, 9.73080444)
})
