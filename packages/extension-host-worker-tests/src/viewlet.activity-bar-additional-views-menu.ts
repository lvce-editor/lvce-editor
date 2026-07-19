export const name = 'viewlet.activity-bar-additional-views-menu'

export const test = async ({ Command, Locator, expect }) => {
  await Command.execute('Layout.handleResize', 800, 180)

  const additionalViews = Locator('.ActivityBarItem[title="Additional Views"]')
  await expect(additionalViews).toBeVisible()
  await additionalViews.click()

  const menu = Locator('#Menu-0')
  await expect(menu).toBeVisible()
  await expect(Locator('#Menu-0 .MenuItem', { hasText: 'Search' })).toBeVisible()
  await expect(Locator('#Menu-0 .MenuItem', { hasText: 'Extensions' })).toBeVisible()
}
