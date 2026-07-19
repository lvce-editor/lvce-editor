export const name = 'viewlet.activity-bar-account-menu-entry'

export const test = async ({ Locator, expect }) => {
  await Locator('.ActivityBarItem[title="Account"]').click()

  const signIn = Locator('#Menu-0 .MenuItem', { hasText: 'Sign In' })
  await expect(signIn).toBeVisible()
  await expect(signIn).toHaveAttribute('role', 'menuitem')
}
