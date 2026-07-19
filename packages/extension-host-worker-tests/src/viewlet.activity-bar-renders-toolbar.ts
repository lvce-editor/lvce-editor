export const name = 'viewlet.activity-bar-renders-toolbar'

export const test = async ({ Locator, expect }) => {
  const activityBar = Locator('#ActivityBar')

  await expect(activityBar).toBeVisible()
  await expect(activityBar).toHaveClass('ActivityBar')
}
