export const name = 'viewlet.title-bar-app-regions'

export const test = async ({ Locator, expect }) => {
  const titleBar = Locator('.TitleBar')
  await expect(titleBar).toHaveCSS('app-region', 'no-drag')

  const titleBarIcon = Locator('.TitleBarIcon')
  await expect(titleBarIcon).toHaveCSS('app-region', 'drag')

  const titleBarMenuEntry = Locator('.TitleBarTopLevelEntry').first()
  await expect(titleBarMenuEntry).toHaveCSS('app-region', 'no-drag')

  const titleBarButtons = Locator('.TitleBarButtons')
  await expect(titleBarButtons).toHaveCSS('app-region', 'drag')
}
