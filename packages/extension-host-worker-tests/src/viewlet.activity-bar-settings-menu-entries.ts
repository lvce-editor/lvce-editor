export const name = 'viewlet.activity-bar-settings-menu-entries'

export const test = async ({ Locator, expect }) => {
  await Locator('.ActivityBarItem[title="Settings"]').click()

  const menu = Locator('#Menu-0')
  await expect(menu).toBeVisible()
  await expect(menu.locator('.MenuItem')).toHaveCount(4)
  await expect(Locator('#Menu-0 .MenuItem', { hasText: 'Command Palette' })).toBeVisible()
  await expect(Locator('#Menu-0 .MenuItem', { hasText: 'Settings' })).toBeVisible()
  await expect(Locator('#Menu-0 .MenuItem', { hasText: 'Keyboard Shortcuts' })).toBeVisible()
  await expect(Locator('#Menu-0 .MenuItem', { hasText: 'Color Theme' })).toBeVisible()
}
