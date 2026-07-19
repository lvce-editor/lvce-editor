export const name = 'viewlet.activity-bar-top-items-are-tabs'

export const test = async ({ Locator, expect }) => {
  const tabs = Locator('#ActivityBar > .ActivityBarItem[role="tab"]')

  await expect(tabs).toHaveCount(5)
  await expect(tabs.nth(0)).toHaveAttribute('title', 'Explorer')
  await expect(tabs.nth(4)).toHaveAttribute('title', 'Extensions')
}
