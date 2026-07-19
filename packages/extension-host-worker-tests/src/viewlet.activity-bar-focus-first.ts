export const name = 'viewlet.activity-bar-focus-first'

export const test = async ({ ActivityBar, Command, Locator, expect }) => {
  await Command.execute('ActivityBar.handleFocus')
  await ActivityBar.focusLast()
  await ActivityBar.focusFirst()

  await expect(Locator('.ActivityBarItem[title="Explorer"]')).toHaveClass('FocusOutline')
}
