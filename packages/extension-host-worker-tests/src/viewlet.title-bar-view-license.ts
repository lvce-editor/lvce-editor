import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.title-bar-view-license'

export const test: Test = async ({ expect, Locator, TitleBarMenuBar }) => {
  await TitleBarMenuBar.focus()
  await TitleBarMenuBar.handleKeyEnd()
  await TitleBarMenuBar.handleKeyArrowDown()

  const viewLicenseItem = Locator('.MenuItem', { hasText: 'View License' })
  await expect(viewLicenseItem).toBeVisible()
  await viewLicenseItem.click()

  const tabTitle = Locator('.MainTab .TabTitle')
  await expect(tabTitle).toHaveText('LICENSE')
  const editor = Locator('.Editor')
  await expect(editor).toContainText('The MIT License (MIT)')
  const editorInput = Locator('[name="editor"]')
  await expect(editorInput).toBeFocused()
}
