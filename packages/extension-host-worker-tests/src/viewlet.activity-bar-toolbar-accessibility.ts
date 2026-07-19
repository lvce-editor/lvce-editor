export const name = 'viewlet.activity-bar-toolbar-accessibility'

export const test = async ({ Locator, expect }) => {
  const activityBar = Locator('#ActivityBar')

  await expect(activityBar).toHaveAttribute('role', 'toolbar')
  await expect(activityBar).toHaveAttribute('aria-orientation', 'vertical')
  await expect(activityBar).toHaveAttribute('aria-roledescription', 'Activity Bar')
  await expect(activityBar).toHaveAttribute('tabindex', '0')
}
