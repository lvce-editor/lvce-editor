export const name = 'viewlet.activity-bar-default-item-count'

export const test = async ({ Locator, expect }) => {
  const items = Locator('#ActivityBar > .ActivityBarItem')

  await expect(items).toHaveCount(7)
}
