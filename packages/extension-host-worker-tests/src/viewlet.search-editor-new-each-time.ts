import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.search-editor-new-each-time'

export const test: Test = async ({ expect, Locator, Main }) => {
  await Main.closeAllEditors()
  await Locator('.ActivityBarItem[title="Search"]').click()

  const searchEditorButton = Locator('#SideBar button[title="Open New Search Editor"]')
  await searchEditorButton.click()
  await searchEditorButton.click()

  const tabs = Locator('.MainTab')
  await expect(tabs).toHaveCount(2)
  await expect(tabs.nth(0).locator('.TabTitle')).toHaveText('Search')
  await expect(tabs.nth(1).locator('.TabTitle')).toHaveText('Search')
  await expect(tabs.nth(0)).toHaveAttribute('aria-selected', 'false')
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true')
}
