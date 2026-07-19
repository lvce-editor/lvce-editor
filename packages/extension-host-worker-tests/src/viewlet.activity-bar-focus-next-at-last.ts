export const name = 'viewlet.activity-bar-focus-next-at-last'

export const test = async ({ ActivityBar, Command, Locator, expect }) => {
  await Command.execute('ActivityBar.handleFocus')
  await ActivityBar.focusLast()
  await ActivityBar.focusNext()

  await expect(Locator('.ActivityBarItem[title="Settings"]')).toHaveClass('FocusOutline')
}
