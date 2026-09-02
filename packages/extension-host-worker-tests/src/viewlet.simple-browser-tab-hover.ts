import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.simple-browser-tab-hover'

// The standard e2e runner is browser-only; this view requires Electron WebContentsView.
export const skip = 1

export const test: Test = async ({ Command, Locator, expect, Settings }) => {
  await Settings.update({ 'simpleBrowser.tabHover.enabled': true })
  await Command.execute('Layout.showPreview', 'simple-browser://')

  await Locator('.SimpleBrowserTab').hover()

  const hover = Locator('.SimpleBrowserTabHover')
  await expect(hover).toBeVisible()
  await expect(hover).toContainText('Memory usage:')
}
