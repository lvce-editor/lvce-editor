import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.title-bar-menu-close-on-application-blur'

export const test: Test = async ({ Command, expect, Locator }) => {
  const helpMenuItem = Locator('.TitleBarTopLevelEntry', { hasText: 'Help' })
  const menu = Locator('.Menu')
  const menuBar = Locator('.TitleBarMenuBar')

  for (let iteration = 0; iteration < 3; iteration++) {
    await helpMenuItem.click()
    await expect(menu).toBeVisible()
    await expect(helpMenuItem).toHaveAttribute('aria-expanded', 'true')

    await Command.execute('Layout.handleBlur')
    await expect(menu).toBeHidden()
    await expect(helpMenuItem).toHaveAttribute('aria-expanded', 'false')
    await expect(helpMenuItem).toHaveAttribute('id', null)
    await expect(menuBar).toHaveAttribute('aria-activedescendant', null)

    await Command.execute('Layout.handleFocus')
    await expect(menu).toBeHidden()
  }
}
