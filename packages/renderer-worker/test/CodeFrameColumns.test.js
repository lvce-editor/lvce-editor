import * as CodeFrameColumns from '../src/parts/CodeFrameColumns/CodeFrameColumns.js'

test('create', () => {
  const code = `test`
  const location = {
    start: { line: 1, column: 1 },
    end: { line: 1, column: 4 },
  }
  expect(CodeFrameColumns.create(code, location)).toBe(``)
})
