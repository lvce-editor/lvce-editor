export const name = 'viewlet.activity-bar-default-selection'

export const test = async ({ Locator, expect }) => {
  const explorer = Locator('.ActivityBarItem[title="Explorer"]')

  await expect(explorer).toHaveAttribute('aria-selected', 'true')
  await expect(explorer).toHaveClass('ActivityBarItemSelected')
}
