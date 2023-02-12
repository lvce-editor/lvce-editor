import * as Desktop from '../src/parts/Desktop/Desktop.js'

test('getDesktop', () => {
  expect(Desktop.getDesktop()).toEqual(expect.any(String))
})
