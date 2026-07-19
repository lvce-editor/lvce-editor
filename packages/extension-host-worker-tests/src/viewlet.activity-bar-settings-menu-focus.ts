export const name = 'viewlet.activity-bar-settings-menu-focus'

export const test = async ({ Locator, expect }) => {
  await Locator('.ActivityBarItem[title="Settings"]').click()

  await expect(Locator('#Menu-0')).toBeVisible()
  await expect(Locator('#Menu-0')).toBeFocused()
}
