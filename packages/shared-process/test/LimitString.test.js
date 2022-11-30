import * as LimitString from '../src/parts/LimitString/LimitString.js'

test('limitString', () => {
  expect(
    LimitString.limitString(
      `line 1
line 2`,
      1
    )
  ).toBe(`line 1`)
})

test('limitString - zero lines', () => {
  expect(
    LimitString.limitString(
      `line 1
line 2`,
      0
    )
  ).toBe(``)
})

test('limitString - multiple lines', () => {
  expect(
    LimitString.limitString(
      `fileA
fileB
nested/fileC`,
      10
    )
  ).toBe(`fileA
fileB
nested/fileC`)
})
