import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.search-editor-accessibility'

export const test: Test = async ({ expect, Locator, Main }) => {
  await Main.closeAllEditors()
  await Locator('.ActivityBarItem[title="Search"]').click()
  await Locator('#SideBar button[title="Open New Search Editor"]').click()

  const tab = Locator('.MainTab')
  await expect(tab).toHaveAttribute('aria-selected', 'true')

  const input = Locator('#Main textarea[name="SearchValue"]')
  await expect(input).toHaveAttribute('autocapitalize', 'off')
  await expect(input).toHaveAttribute('autocorrect', 'off')
  await expect(input).toHaveAttribute('spellcheck', 'false')
}
