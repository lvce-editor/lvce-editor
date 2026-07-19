export const name = 'viewlet.activity-bar-switch-explorer-to-search'

export const test = async ({ Locator, expect }) => {
  const explorer = Locator('.ActivityBarItem[title="Explorer"]')
  const search = Locator('.ActivityBarItem[title="Search"]')

  await search.click()

  await expect(explorer).toHaveAttribute('aria-selected', 'false')
  await expect(search).toHaveAttribute('aria-selected', 'true')
  await expect(Locator('.SideBarTitleAreaTitle')).toHaveText('Search')
}
