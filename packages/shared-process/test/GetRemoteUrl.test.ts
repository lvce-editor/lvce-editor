import { expect, test } from '@jest/globals'
import { pathToFileURL } from 'node:url'
import * as GetRemoteUrl from '../src/parts/GetRemoteUrl/GetRemoteUrl.js'

test('getRemoteUrl - posix path', () => {
  const path = '/tmp/sample.js'
  const expected = `/remote${pathToFileURL(path).toString().slice('file://'.length)}`

  expect(GetRemoteUrl.getRemoteUrl(path)).toBe(expected)
})
