export const name = 'viewlet.activity-bar-default-item-order'

export const test = async ({ Locator, expect }) => {
  const items = Locator('#ActivityBar > .ActivityBarItem')

  await expect(items.nth(0)).toHaveAttribute('title', 'Explorer')
  await expect(items.nth(1)).toHaveAttribute('title', 'Search')
  await expect(items.nth(2)).toHaveAttribute('title', 'Source Control')
  await expect(items.nth(3)).toHaveAttribute('title', 'Run and Debug')
  await expect(items.nth(4)).toHaveAttribute('title', 'Extensions')
  await expect(items.nth(5)).toHaveAttribute('title', 'Account')
  await expect(items.nth(6)).toHaveAttribute('title', 'Settings')
}
