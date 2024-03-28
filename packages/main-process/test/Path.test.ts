import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'
import * as Path from '../src/parts/Path/Path.js'

test('absolute', () => {
  // TODO need better test here
  expect(Path.absolute('./some-file.txt')).toContain('some-file.txt')
})
