import { expect, test } from '@jest/globals'
import * as GetElectronFileResponseAbsolutePath from '../src/parts/GetElectronFileResponseAbsolutePath/GetElectronFileResponseAbsolutePath.js'

const normalizePath = (path: string) => path.replaceAll('\\', '/')

test('maps /icons requests to renderer-worker codicons', () => {
  const absolutePath = GetElectronFileResponseAbsolutePath.getElectronFileResponseAbsolutePath('/icons/chevron-right.svg')

  expect(normalizePath(absolutePath)).toContain('/packages/renderer-worker/node_modules/@vscode/codicons/src/icons/chevron-right.svg')
})

test('falls back to static/icons for non-codicon assets', () => {
  const absolutePath = GetElectronFileResponseAbsolutePath.getElectronFileResponseAbsolutePath('/icons/squiggly-error.svg')

  expect(normalizePath(absolutePath)).toContain('/static/icons/squiggly-error.svg')
})

test('maps remote posix requests to absolute paths', () => {
  const absolutePath = GetElectronFileResponseAbsolutePath.getElectronFileResponseAbsolutePath('/remote/tmp/sample.js')

  expect(normalizePath(absolutePath)).toBe('/tmp/sample.js')
})

test('maps remote windows drive letter requests to absolute paths', () => {
  const absolutePath = GetElectronFileResponseAbsolutePath.getElectronFileResponseAbsolutePath('/remote/D:/a/sample.js')
  const expected = process.platform === 'win32' ? 'D:/a/sample.js' : '/D:/a/sample.js'

  expect(normalizePath(absolutePath)).toBe(expected)
})

test('maps remote windows drive letter requests with backslashes to absolute paths', () => {
  const absolutePath = GetElectronFileResponseAbsolutePath.getElectronFileResponseAbsolutePath('/remote/D:\\a\\sample.js')
  const expected = process.platform === 'win32' ? 'D:/a/sample.js' : '/D:/a/sample.js'

  expect(normalizePath(absolutePath)).toBe(expected)
})

test('rejects malformed remote windows drive letter requests', () => {
  expect(() => GetElectronFileResponseAbsolutePath.getElectronFileResponseAbsolutePath('/remote/D:asample.js')).toThrow(
    GetElectronFileResponseAbsolutePath.InvalidRemotePathError,
  )
})
