export const name = 'viewlet.activity-bar-select-current'

export const test = async ({ ActivityBar, Command, Locator, expect }) => {
  await Command.execute('ActivityBar.handleFocus')
  await ActivityBar.focusNext()
  await ActivityBar.selectCurrent()

  await expect(Locator('.SideBarTitleAreaTitle')).toHaveText('Search')
  await expect(Locator('.ActivityBarItem[title="Search"]')).toHaveAttribute('aria-selected', 'true')
}
