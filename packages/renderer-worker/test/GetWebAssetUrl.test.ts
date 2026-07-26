import { expect, test } from '@jest/globals'
import * as GetWebAssetUrl from '../src/parts/GetWebAssetUrl/GetWebAssetUrl.js'

test('returns an absolute url for a root-relative asset directory', () => {
  expect(GetWebAssetUrl.getWebAssetUrl('/lvce-editor/abc123', 'config.json', 'https://lvce-editor.github.io')).toBe(
    'https://lvce-editor.github.io/lvce-editor/abc123/config.json',
  )
})

test('preserves an absolute asset directory', () => {
  expect(GetWebAssetUrl.getWebAssetUrl('https://example.com/static/abc123/', 'LICENSE', 'https://unused.example.com')).toBe(
    'https://example.com/static/abc123/LICENSE',
  )
})
