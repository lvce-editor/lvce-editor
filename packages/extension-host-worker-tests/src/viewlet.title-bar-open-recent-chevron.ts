export const name = 'viewlet.title-bar-open-recent-chevron'

export const test = async ({ TitleBarMenuBar, Locator, expect }) => {
  await TitleBarMenuBar.focus()
  await TitleBarMenuBar.handleKeyArrowDown()

  const menu = Locator('#Menu-0')
  const openRecent = menu.locator('.MenuItemSubMenu')
  const chevron = openRecent.locator('.MenuItemSubMenuArrowRight')

  await expect(openRecent).toBeVisible()
  await expect(chevron).toBeVisible()
  await expect(chevron).toHaveCSS('width', '16px')
  await expect(chevron).toHaveCSS('height', '16px')
  await expect(chevron).toHaveCSS('mask-image', /chevron-right\.svg/)
  await expect(chevron).toHaveCSS('mask-mode', 'alpha')

  await TitleBarMenuBar.handleKeyEnd()
  await TitleBarMenuBar.handleKeyArrowUp()
  await TitleBarMenuBar.handleKeyArrowUp()

  const focusedOpenRecent = menu.locator('.MenuItemSubMenu.MenuItemFocused')
  const focusedChevron = focusedOpenRecent.locator('.MenuItemSubMenuArrowRight')
  await expect(focusedChevron).toBeVisible()
  await expect(focusedOpenRecent).toBeFocused()

  await TitleBarMenuBar.handleKeyArrowRight()
  await expect(focusedOpenRecent).toHaveAttribute('aria-expanded', 'true')
  await expect(Locator('#Menu-1')).toBeVisible()
}
