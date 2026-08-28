import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.error-syntax-highlighting'

export const test: Test = async ({ ActivityBar, expect, Extension, Locator }) => {
  await Extension.addWebExtension(new URL('../fixtures/sample.view-error-syntax-highlighting/', import.meta.url).href)
  await ActivityBar.handleExtensionsChanged()

  const activityBarItem = Locator('.ActivityBarItem[title="Error Syntax Highlighting"]')
  await expect(activityBarItem).toBeVisible()
  await activityBarItem.click()

  await expect(Locator('.Viewlet.Error')).toBeVisible()
  const codeFrame = Locator('.Viewlet.Error .SyntaxHighlightedCodeFrame')
  await expect(codeFrame).toBeVisible()
  await expect(codeFrame).toContainText("throw new Error('Synthetic view creation failure')")
  await expect(codeFrame.locator('.Token').first()).toBeVisible()
}
