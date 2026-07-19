export const name = 'viewlet.activity-bar-bottom-items-are-buttons'

export const test = async ({ Locator, expect }) => {
  const buttons = Locator('#ActivityBar > .ActivityBarItem[role="button"]')

  await expect(buttons).toHaveCount(2)
  await expect(buttons.nth(0)).toHaveAttribute('title', 'Account')
  await expect(buttons.nth(1)).toHaveAttribute('title', 'Settings')
}
