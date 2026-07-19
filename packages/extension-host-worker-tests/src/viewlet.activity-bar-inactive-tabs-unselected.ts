export const name = 'viewlet.activity-bar-inactive-tabs-unselected'

export const test = async ({ Locator, expect }) => {
  await expect(Locator('.ActivityBarItem[title="Search"]')).toHaveAttribute('aria-selected', 'false')
  await expect(Locator('.ActivityBarItem[title="Source Control"]')).toHaveAttribute('aria-selected', 'false')
  await expect(Locator('.ActivityBarItem[title="Run and Debug"]')).toHaveAttribute('aria-selected', 'false')
  await expect(Locator('.ActivityBarItem[title="Extensions"]')).toHaveAttribute('aria-selected', 'false')
}
