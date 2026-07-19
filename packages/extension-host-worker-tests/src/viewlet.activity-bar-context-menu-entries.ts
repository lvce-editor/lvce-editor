export const name = 'viewlet.activity-bar-context-menu-entries'

export const test = async ({ Locator, expect }) => {
  await Locator('#ActivityBar').click({ button: 'right' })

  const menu = Locator('#Menu-0')
  await expect(menu).toBeVisible()
  await expect(menu.locator('.MenuItem')).toHaveCount(9)
  await expect(Locator('#Menu-0 .MenuItem', { hasText: 'Explorer' })).toBeVisible()
  await expect(Locator('#Menu-0 .MenuItem', { hasText: 'Search' })).toBeVisible()
  await expect(Locator('#Menu-0 .MenuItem', { hasText: 'Move Side Bar Left' })).toBeVisible()
  await expect(Locator('#Menu-0 .MenuItem', { hasText: 'Hide Activity Bar' })).toBeVisible()
}
