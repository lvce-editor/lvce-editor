export const name = 'viewlet.activity-bar-focus-next'

export const test = async ({ ActivityBar, Command, Locator, expect }) => {
  await Command.execute('ActivityBar.handleFocus')
  await ActivityBar.focusNext()

  await expect(Locator('.ActivityBarItem[title="Search"]')).toHaveClass('FocusOutline')
}
