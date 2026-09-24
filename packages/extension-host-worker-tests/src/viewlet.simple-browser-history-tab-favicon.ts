import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.simple-browser-history-tab-favicon'

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Layout.showPreview', 'simple-browser://')
  await Command.execute('SimpleBrowser.openHistory')

  const historyIcon = Locator('.SimpleBrowserTabSelected .SimpleBrowserTabHistoryFavicon')
  await expect(historyIcon).toBeVisible()
  await expect(historyIcon).toHaveCSS('mask-image', 'url("http://localhost:3000/icons/history.svg")')
}
