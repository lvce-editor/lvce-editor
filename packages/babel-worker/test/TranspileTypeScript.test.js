import * as TranspileTypeScript from '../src/parts/TranspileTypeScript/TranspileTypeScript.js'

test('transpileTypeScript', () => {
  expect(TranspileTypeScript.transpileTypeScript(`let x: number = 1`)).toBe(`let x = 1;`)
})
