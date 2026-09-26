import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.title-bar-menu-clear-highlight-on-mouse-leave'

// Enabled after the menu-worker and renderer-process fixes are integrated.
export const skip = 1

export const test: Test = async ({ expect, Locator }) => {
  const helpMenuItem = Locator('.TitleBarTopLevelEntry', { hasText: 'Help' })
  await helpMenuItem.click()

  const menu = Locator('#Menu-0')
  await expect(menu).toBeVisible()

  const aboutItem = Locator('#Menu-0 .MenuItem', { hasText: 'About' })
  const focusedItem = Locator('#Menu-0 .MenuItem.MenuItemFocused')
  await aboutItem.hover()
  await expect(focusedItem).toHaveText('About')

  await Locator('.EditorRow').first().hover()
  await expect(menu).toBeVisible()
  await expect(Locator('.MenuItemFocused')).toHaveCount(0)

  await aboutItem.hover()
  await expect(focusedItem).toHaveText('About')
}
