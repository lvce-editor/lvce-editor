import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.simple-browser-toolbar-menu'

// The standard e2e runner is browser-only; this view requires Electron WebContentsView.
export const skip = 1

export const test: Test = async ({ Command, Locator, expect }) => {
  await Command.execute('Layout.showPreview', 'simple-browser://')

  const menuButton = Locator('.SimpleBrowserMenuButton')
  await expect(menuButton).toHaveAttribute('aria-label', 'Customize and control Simple Browser')
  await menuButton.click()

  const menu = Locator('#Menu-0')
  await expect(menu).toBeVisible()
  await expect(menu).toContainText('New Tab')
  await expect(menu).toContainText('Downloads')
  await expect(menu).toContainText('Zoom In')
  await expect(menu).toContainText('Zoom Out')
  await expect(menu).toContainText('Reset Zoom')
  await expect(menu).toContainText('Toggle Developer Tools')

  await Locator('#Menu-0 .MenuItem', { hasText: 'New Tab' }).click()
  await expect(Locator('.SimpleBrowserTab')).toHaveCount(2)

  await menuButton.click()
  await Locator('#Menu-0 .MenuItem', { hasText: 'Close Tab' }).click()
  await expect(Locator('.SimpleBrowserTab')).toHaveCount(1)
}
