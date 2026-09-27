import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.title-bar-menu-help-about-closes-menu'

export const test: Test = async ({ expect, KeyBoard, Locator, TitleBarMenuBar }) => {
  const menu = Locator('#Menu-0')
  const aboutDialog = Locator('[role="dialog"]')
  const aboutButton = Locator('[role="dialog"] button[name="Ok"]')
  const app = Locator('.App')
  const helpEntry = Locator('.TitleBarTopLevelEntry', { hasText: 'Help' })

  // Open About with the mouse and verify menu dismissal and focus restoration.
  await helpEntry.click()
  await expect(menu).toBeVisible()
  const aboutItem = Locator('.MenuItem', { hasText: 'About' })
  await aboutItem.click()
  await expect(menu).toBeHidden()
  await expect(aboutDialog).toBeVisible()
  await aboutButton.click()
  await expect(aboutDialog).toBeHidden()
  await expect(app).toBeFocused()

  // Open About with the keyboard and verify the same behavior.
  await TitleBarMenuBar.focus()
  await TitleBarMenuBar.handleKeyEnd()
  await TitleBarMenuBar.handleKeyArrowDown()
  await expect(menu).toBeVisible()
  await TitleBarMenuBar.handleKeyEnd()
  await expect(aboutItem).toBeFocused()
  await KeyBoard.press('Enter')
  await expect(menu).toBeHidden()
  await expect(aboutDialog).toBeVisible()
  await aboutButton.click()
  await expect(aboutDialog).toBeHidden()
  await expect(app).toBeFocused()
}
