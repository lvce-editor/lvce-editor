import { expect, test } from '@jest/globals'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import * as GetElectronFileResponseAbsolutePath from '../src/parts/GetElectronFileResponseAbsolutePath/GetElectronFileResponseAbsolutePath.js'
import * as GetElectronFileResponseRelativePath from '../src/parts/GetElectronFileResponseRelativePath/GetElectronFileResponseRelativePath.js'
import * as GetRemoteUrl from '../src/parts/GetRemoteUrl/GetRemoteUrl.js'

const normalizePath = (path: any): any => path.replaceAll('\\', '/')

test('maps /icons requests to renderer-worker codicons', () => {
  const absolutePath = GetElectronFileResponseAbsolutePath.getElectronFileResponseAbsolutePath('/icons/chevron-right.svg')

  expect(normalizePath(absolutePath)).toContain('/packages/renderer-worker/node_modules/@vscode/codicons/src/icons/chevron-right.svg')
})

test('falls back to static/icons for non-codicon assets', () => {
  const absolutePath = GetElectronFileResponseAbsolutePath.getElectronFileResponseAbsolutePath('/icons/squiggly-error.svg')

  expect(normalizePath(absolutePath)).toContain('/static/icons/squiggly-error.svg')
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
