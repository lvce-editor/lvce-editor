export const name = 'viewlet.activity-bar-focus-previous'

export const test = async ({ ActivityBar, Command, Locator, expect }) => {
  await Command.execute('ActivityBar.handleFocus')
  await ActivityBar.focusNext()
  await ActivityBar.focusPrevious()

  await expect(Locator('.ActivityBarItem[title="Explorer"]')).toHaveClass('FocusOutline')
}
