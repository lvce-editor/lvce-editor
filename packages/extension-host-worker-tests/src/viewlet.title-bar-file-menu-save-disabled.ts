export const name = 'viewlet.title-bar-file-menu-save-disabled'

export const skip = 1

export const test = async ({ TitleBarMenuBar, Locator, expect }) => {
  await TitleBarMenuBar.focus()
  await TitleBarMenuBar.handleKeyArrowDown()

  const menu = Locator('#Menu-0')
  await expect(menu).toBeVisible()

  const save = menu.locator('.MenuItem', { hasText: 'Save' })
  const saveAll = menu.locator('.MenuItem', { hasText: 'Save All' })

  await expect(save).toHaveClass(/MenuItemDisabled/)
  await expect(save).toHaveAttribute('aria-disabled', 'true')
  await expect(saveAll).toHaveClass(/MenuItemDisabled/)
  await expect(saveAll).toHaveAttribute('aria-disabled', 'true')
}
