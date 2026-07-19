export const name = 'viewlet.activity-bar-focus-selected-item'

export const test = async ({ Command, Locator, expect }) => {
  await Command.execute('ActivityBar.handleFocus')

  await expect(Locator('.ActivityBarItem[title="Explorer"]')).toHaveClass('FocusOutline')
}
