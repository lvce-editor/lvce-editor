export const name = 'viewlet.activity-bar-explorer-click-hides-sidebar'

export const test = async ({ Locator, expect }) => {
  const explorer = Locator('.ActivityBarItem[title="Explorer"]')

  await explorer.click()

  await expect(Locator('#SideBar')).toBeHidden()
  await expect(explorer).toHaveAttribute('aria-selected', 'false')
}
