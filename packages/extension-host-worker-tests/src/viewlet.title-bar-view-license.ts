export const name = 'viewlet.title-bar-view-license'

export const test = async ({ TitleBarMenuBar, Locator, expect }) => {
  await TitleBarMenuBar.focus()
  await TitleBarMenuBar.handleKeyEnd()
  await TitleBarMenuBar.handleKeyArrowDown()

  const viewLicenseItem = Locator('.MenuItem', { hasText: 'View License' })
  await expect(viewLicenseItem).toBeVisible()
  await viewLicenseItem.click()

  const tabTitle = Locator('.MainTab .TabTitle')
  await expect(tabTitle).toHaveText('LICENSE')
  const editor = Locator('.Editor')
  await expect(editor).toContainText('The MIT License (MIT)')
}
