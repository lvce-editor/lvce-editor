import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.search-editor-context-lines'

export const test: Test = async ({ expect, Locator, Main }) => {
  await Main.closeAllEditors()
  await Locator('.ActivityBarItem[title="Search"]').click()

  await expect(Locator('#SideBar input[name="ContextLines"]')).toHaveCount(0)
  await expect(Locator('#SideBar button[name="ToggleContextLines"]')).toHaveCount(0)

  await Locator('#SideBar button[title="Open New Search Editor"]').click()

  const contextLinesInput = Locator('#Main input[name="ContextLines"]')
  const toggleContextLines = Locator('#Main button[name="ToggleContextLines"]')
  await expect(contextLinesInput).toBeVisible()
  await expect(contextLinesInput).toHaveValue('1')
  await expect(toggleContextLines).toBeVisible()
  await expect(toggleContextLines).toHaveAttribute('aria-checked', 'false')

  await toggleContextLines.click()
  await expect(toggleContextLines).toHaveAttribute('aria-checked', 'true')
}
