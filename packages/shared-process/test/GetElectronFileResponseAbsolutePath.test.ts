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
