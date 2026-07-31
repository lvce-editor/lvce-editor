import { expect, test } from '@jest/globals'
import { getIconThemeEtag } from '../src/parts/GetIconThemeEtag/GetIconThemeEtag.js'

test('returns the build-provided etag for the production built-in icon theme', () => {
  expect(getIconThemeEtag('vscode-icons', true, 'content-hash')).toBe('content-hash')
})

test('returns no etag during development', () => {
  expect(getIconThemeEtag('vscode-icons', false, 'content-hash')).toBe('')
})

test('returns no etag for extension-provided icon themes', () => {
  expect(getIconThemeEtag('custom-icons', true, 'content-hash')).toBe('')
})
