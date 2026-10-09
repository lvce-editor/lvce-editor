import { expect, test } from '@jest/globals'
import { rewriteCssAssetUrls, rewriteElectronFontUrl } from '../src/parts/RewriteCssAssetUrls/RewriteCssAssetUrls.ts'

test('packaged CSS addresses the bundled font directly while keeping other assets and fonts on their original routes', () => {
  const css = `@font-face { src: url('/fonts/FiraCode-VariableFont.ttf'); }
    .icon { mask-image: url('/icons/close.svg'); }
    @font-face { src: url('/fonts/custom.ttf'); }`
  const bundled = rewriteCssAssetUrls(css, '/abc123')
  expect(rewriteElectronFontUrl(bundled, '/abc123', 'custom-editor'))
    .toBe(`@font-face { src: url('custom-editor-font://-/fonts/FiraCode-VariableFont.ttf'); }
    .icon { mask-image: url('/abc123/icons/close.svg'); }
    @font-face { src: url('/abc123/fonts/custom.ttf'); }`)
  expect(bundled).toContain("url('/abc123/fonts/FiraCode-VariableFont.ttf')")
})
