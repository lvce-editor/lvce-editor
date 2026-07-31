import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.activity-bar-panel-resize'

export const test: Test = async ({ Command, Locator, expect }) => {
  const additionalViews = Locator('.ActivityBarItem[title="Additional Views"]')
  const search = Locator('.ActivityBarItem[title="Search"]')

  await Command.execute('Layout.handleResize', 800, 720)
  await Command.execute('Layout.showPanel', 'Problems')
  await Command.execute('Layout.handleSashPointerDown', 'Panel')
  await Command.execute('Layout.handleSashPointerMove', 0, 180)

  await expect(additionalViews).toBeVisible()
  await expect(search).toHaveCount(0)

  await Command.execute('Layout.handleSashPointerMove', 0, 600)

  await expect(additionalViews).toHaveCount(0)
  await expect(search).toBeVisible()
}
