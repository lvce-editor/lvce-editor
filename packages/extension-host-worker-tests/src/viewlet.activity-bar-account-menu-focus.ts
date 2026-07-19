export const name = 'viewlet.activity-bar-account-menu-focus'

export const test = async ({ Locator, expect }) => {
  await Locator('.ActivityBarItem[title="Account"]').click()

  const menu = Locator('#Menu-0')
  await expect(menu).toBeVisible()
  await expect(menu).toBeFocused()
}
