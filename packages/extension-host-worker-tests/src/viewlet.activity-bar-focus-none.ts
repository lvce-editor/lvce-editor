export const name = 'viewlet.activity-bar-focus-none'

export const test = async ({ Command, Locator, expect }) => {
  await Command.execute('ActivityBar.handleFocus')
  await Command.execute('ActivityBar.focusNone')

  await expect(Locator('#ActivityBar .FocusOutline')).toHaveCount(0)
}
