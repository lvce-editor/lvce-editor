import { expect, test } from '@jest/globals'
import { rewriteCssAssetUrls } from '../src/parts/RewriteCssAssetUrls/RewriteCssAssetUrls.ts'

test('packaged CSS addresses bundled package fonts directly while keeping other assets on their original routes', () => {
  const css = `@font-face { src: url('/fonts/files/fira-code-latin-400-normal.woff2'); }
    .icon { mask-image: url('/icons/close.svg'); }
    @font-face { src: url('/fonts/custom.woff'); }`
  const bundled = rewriteCssAssetUrls(css, '/abc123')
  expect(bundled)
    .toBe(`@font-face { src: url('/abc123/fonts/files/fira-code-latin-400-normal.woff2'); }
    .icon { mask-image: url('/abc123/icons/close.svg'); }
    @font-face { src: url('/abc123/fonts/custom.woff'); }`)
  expect(bundled).toContain("url('/abc123/fonts/files/fira-code-latin-400-normal.woff2')")
})
