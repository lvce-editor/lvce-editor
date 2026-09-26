import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.title-bar-menu-clear-highlight-on-mouse-leave'

// Enabled after the menu-worker and renderer-process fixes are integrated.
export const skip = 1

export const test: Test = async ({ expect, Locator }) => {
  const helpMenuItem = Locator('.TitleBarTopLevelEntry', { hasText: 'Help' })
  await helpMenuItem.click()

  const menu = Locator('#Menu-0')
  await expect(menu).toBeVisible()

  const aboutItem = menu.locator('.MenuItem', { hasText: 'About' })
  await aboutItem.hover()
  await expect(aboutItem).toHaveClass(/MenuItemFocused/)

  await Locator('.EditorRow').first().hover()
  await expect(menu).toBeVisible()
  await expect(menu.locator('.MenuItemFocused')).toHaveCount(0)

  await aboutItem.hover()
  await expect(aboutItem).toHaveClass(/MenuItemFocused/)
}
