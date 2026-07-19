export const name = 'viewlet.activity-bar-focus-last'

export const test = async ({ ActivityBar, Command, Locator, expect }) => {
  await Command.execute('ActivityBar.handleFocus')
  await ActivityBar.focusLast()

  await expect(Locator('.ActivityBarItem[title="Settings"]')).toHaveClass('FocusOutline')
}
