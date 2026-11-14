import { expect, test } from '@jest/globals'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as GetElectronFileResponseAbsolutePath from '../src/parts/GetElectronFileResponseAbsolutePath/GetElectronFileResponseAbsolutePath.js'
import * as GetElectronFileResponseRelativePath from '../src/parts/GetElectronFileResponseRelativePath/GetElectronFileResponseRelativePath.js'
import * as GetRemoteUrl from '../src/parts/GetRemoteUrl/GetRemoteUrl.js'

const normalizePath = (path: any): any => path.replaceAll('\\', '/')
const indexHtmlPattern = /\/index\.html$/

test('maps /icons requests to renderer-worker codicons', () => {
  const absolutePath = GetElectronFileResponseAbsolutePath.getElectronFileResponseAbsolutePath('/icons/chevron-right.svg')

  expect(normalizePath(absolutePath)).toContain('/packages/renderer-worker/node_modules/@vscode/codicons/src/icons/chevron-right.svg')
})

test.each(['/board', '/board/', '/prefix/board', '/chat'])('maps application route %s to index.html', (pathName) => {
  const absolutePath = GetElectronFileResponseAbsolutePath.getElectronFileResponseAbsolutePath(pathName)

  expect(normalizePath(absolutePath)).toMatch(indexHtmlPattern)
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

test.each(['process explorer.js', 'process#explorer?.js', 'process%23explorer.js', 'process-é.js'])(
  'remote worker file URL round-trips reserved and Unicode path characters: %s',
  (name) => {
    const path = join(tmpdir(), name)
    const url = GetRemoteUrl.getRemoteUrl(path)
    const relativePath = GetElectronFileResponseRelativePath.getElectronFileResponseRelativePath(url)
    expect(GetElectronFileResponseAbsolutePath.getElectronFileResponseAbsolutePath(relativePath)).toBe(path)
  },
)
