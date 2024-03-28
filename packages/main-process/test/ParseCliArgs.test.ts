import { beforeAll, afterAll, test, expect, beforeEach, afterEach } from '@jest/globals'
import * as ParseCliArgs from '../src/parts/ParseCliArgs/ParseCliArgs.js'

test('parseCliArgs', () => {
  expect(ParseCliArgs.parseCliArgs(['/usr/lib/lvce-oss/lvce-oss', '/test/'])).toEqual({
    _: ['/test/'],
    help: false,
    v: false,
    version: false,
    wait: false,
    'built-in-self-test': false,
    web: false,
    sandbox: false,
  })
})
