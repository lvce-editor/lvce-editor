import * as ErrorType from '../src/parts/ErrorType/ErrorType.js'
import * as GetErrorConstructor from '../src/parts/GetErrorConstructor/GetErrorConstructor.js'

test('getErrorConstructor - DOMException', () => {
  expect(GetErrorConstructor.getErrorConstructor('', ErrorType.DomException)).toBe(DOMException)
})

test('getErrorConstructor - TypeError', () => {
  expect(GetErrorConstructor.getErrorConstructor('', ErrorType.TypeError)).toBe(TypeError)
})

test('getErrorConstructor - SyntaxError', () => {
  expect(GetErrorConstructor.getErrorConstructor('', ErrorType.SyntaxError)).toBe(SyntaxError)
})

test('getErrorConstructor - ReferenceError', () => {
  expect(GetErrorConstructor.getErrorConstructor('', ErrorType.ReferenceError)).toBe(ReferenceError)
})

test('getErrorConstructor - RangeError', () => {
  expect(GetErrorConstructor.getErrorConstructor('', ErrorType.RangeError)).toBe(RangeError)
})

test('getErrorConstructor - unknown', () => {
  expect(GetErrorConstructor.getErrorConstructor('', '')).toBe(Error)
})
