export const name = 'viewlet.activity-bar-popup-items'

export const test = async ({ Locator, expect }) => {
  const account = Locator('.ActivityBarItem[title="Account"]')
  const settings = Locator('.ActivityBarItem[title="Settings"]')

  await expect(account).toHaveAttribute('aria-haspopup', 'true')
  await expect(settings).toHaveAttribute('aria-haspopup', 'true')
}
