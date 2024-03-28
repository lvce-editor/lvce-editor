import { BabelParseError } from '../src/parts/BabelParseError/BabelParseError.js'
import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'

test('name', () => {
  const error = new SyntaxError('')
  // @ts-ignore
  error.loc = { line: 0, column: 0 }
  const babelParseError = new BabelParseError('', error)
  expect(babelParseError.name).toBe('BabelParseError')
})
