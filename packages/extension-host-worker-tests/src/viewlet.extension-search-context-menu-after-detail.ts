import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.extension-search-context-menu-after-detail'

export const test: Test = async ({ expect, ExtensionSearch, Locator }) => {
  await ExtensionSearch.open()
  await ExtensionSearch.handleInput('atom')
  const firstExtension = Locator('.ExtensionListItem').first()
  await expect(firstExtension).toBeVisible()
  await ExtensionSearch.handleClick(0)
  const extensionDetail = Locator('.ExtensionDetail')
  await expect(extensionDetail).toBeVisible()

  await ExtensionSearch.handleContextMenu(0, 100, 100)

  const contextMenu = Locator('.Menu')
  await expect(contextMenu).toBeVisible()
}
