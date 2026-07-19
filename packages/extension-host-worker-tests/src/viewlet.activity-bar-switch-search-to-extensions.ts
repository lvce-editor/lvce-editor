export const name = 'viewlet.activity-bar-switch-search-to-extensions'

export const test = async ({ Locator, expect }) => {
  const extensions = Locator('.ActivityBarItem[title="Extensions"]')
  const search = Locator('.ActivityBarItem[title="Search"]')

  await search.click()
  await expect(Locator('.SideBarTitleAreaTitle')).toHaveText('Search')
  await extensions.click()

  await expect(search).toHaveAttribute('aria-selected', 'false')
  await expect(extensions).toHaveAttribute('aria-selected', 'true')
  await expect(Locator('.SideBarTitleAreaTitle')).toHaveText('Extensions: Installed')
}
