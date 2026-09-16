export const name = 'viewlet.title-bar-file-menu-save-disabled'

export const test = async ({ TitleBarMenuBar, Locator, expect }) => {
  await TitleBarMenuBar.focus()
  await TitleBarMenuBar.handleKeyArrowDown()

  const menu = Locator('#Menu-0')
  await expect(menu).toBeVisible()

  const disabledItems = menu.locator('.MenuItem[aria-disabled="true"]')
  const save = disabledItems.nth(0)
  const saveAll = disabledItems.nth(1)

  await expect(save).toHaveClass('MenuItemDisabled')
  await expect(save).toHaveAttribute('aria-disabled', 'true')
  await expect(saveAll).toHaveClass('MenuItemDisabled')
  await expect(saveAll).toHaveAttribute('aria-disabled', 'true')

  await save.hover()
  await expect(save).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)')

  const newFile = menu.locator('.MenuItem').nth(0)
  await newFile.hover()
  await expect(newFile).toHaveCSS('background-color', /^rgb\(/)
}
