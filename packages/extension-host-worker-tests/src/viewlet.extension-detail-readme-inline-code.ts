import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.extension-detail-readme-inline-code'

export const test: Test = async ({ expect, Extension, ExtensionDetail, Locator }) => {
  const extensionUri = new URL('../fixtures/sample.extension-readme-inline-code', import.meta.url).toString()
  await Extension.addWebExtension(extensionUri)
  await ExtensionDetail.open('test.extension-readme-inline-code')

  const paragraph = Locator('.ExtensionDetail .Markdown p').first()
  await expect(paragraph).toHaveText('Relative imports, package main, conditional exports, and CommonJS require are supported.')

  const code = paragraph.locator('code')
  await expect(code).toHaveCount(3)
  const main = code.nth(0)
  const exports = code.nth(1)
  const require = code.nth(2)
  await expect(main).toHaveText('main')
  await expect(exports).toHaveText('exports')
  await expect(require).toHaveText('require')
  await expect(main).toHaveCSS('display', 'inline')
  await expect(exports).toHaveCSS('display', 'inline')
  await expect(require).toHaveCSS('display', 'inline')

  const link = Locator('.ExtensionDetail .Markdown a')
  await expect(link).toHaveText('extension guide')
  await expect(link).toHaveAttribute('href', 'https://example.com/extension-guide')

  const highlightedKeyword = Locator('.ExtensionDetail .Markdown pre .Token.Keyword')
  await expect(highlightedKeyword).toHaveText('const')
}
