import * as Compare from '../src/parts/Compare/Compare.js'

test('compareString', () => {
  expect(Compare.compareString('a', 'b')).toBe(-1)
})
