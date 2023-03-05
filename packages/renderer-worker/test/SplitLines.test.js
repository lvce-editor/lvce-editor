import { AssertionError } from '../src/parts/AssertionError/AssertionError.js'
import * as SplitLines from '../src/parts/SplitLines/SplitLines.js'

test('splitLines - undefined', () => {
  expect(() => SplitLines.splitLines(undefined)).toThrowError(new AssertionError('expected value to be of type string'))
})
