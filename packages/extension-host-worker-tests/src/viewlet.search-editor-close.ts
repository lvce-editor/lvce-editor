import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.search-editor-close'

export const test: Test = async ({ expect, Locator, Main }) => {
  await Main.closeAllEditors()
  await Locator('.ActivityBarItem[title="Search"]').click()
  await Locator('#SideBar button[title="Open New Search Editor"]').click()

  const tab = Locator('.MainTab')
  await expect(tab).toHaveCount(1)
  await tab.locator('.EditorTabCloseButton').click()

  await expect(tab).toHaveCount(0)
  await expect(Locator('#Main .Search')).toHaveCount(0)
}
