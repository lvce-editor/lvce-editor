import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.activity-bar-window-resize'

export const test: Test = async ({ Command, Locator, expect }) => {
  const additionalViews = Locator('.ActivityBarItem[title="Additional Views"]')
  const search = Locator('.ActivityBarItem[title="Search"]')

  await Command.execute('Layout.handleResize', 800, 180)

  await expect(additionalViews).toBeVisible()
  await expect(search).toHaveCount(0)

  await Command.execute('Layout.handleResize', 800, 720)

  await expect(additionalViews).toHaveCount(0)
  await expect(search).toBeVisible()
}
