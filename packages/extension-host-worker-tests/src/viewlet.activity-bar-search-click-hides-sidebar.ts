export const name = 'viewlet.activity-bar-search-click-hides-sidebar'

export const test = async ({ Locator, expect }) => {
  const search = Locator('.ActivityBarItem[title="Search"]')

  await search.click()
  await search.click()

  await expect(Locator('#SideBar')).toBeHidden()
  await expect(search).toHaveAttribute('aria-selected', 'false')
}
