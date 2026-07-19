export const name = 'viewlet.activity-bar-focus-previous-at-first'

export const test = async ({ ActivityBar, Command, Locator, expect }) => {
  await Command.execute('ActivityBar.handleFocus')
  await ActivityBar.focusPrevious()

  await expect(Locator('.ActivityBarItem[title="Explorer"]')).toHaveClass('FocusOutline')
}
