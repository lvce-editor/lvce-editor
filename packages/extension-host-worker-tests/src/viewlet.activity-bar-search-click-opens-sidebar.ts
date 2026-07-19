export const name = 'viewlet.activity-bar-search-click-opens-sidebar'

export const test = async ({ Locator, expect }) => {
  const search = Locator('.ActivityBarItem[title="Search"]')

  await search.click()

  await expect(Locator('.SideBarTitleAreaTitle')).toHaveText('Search')
  await expect(search).toHaveAttribute('aria-selected', 'true')
}
