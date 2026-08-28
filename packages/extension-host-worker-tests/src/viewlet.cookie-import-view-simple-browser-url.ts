import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.cookie-import-view-simple-browser-url'

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Main.openUri', 'simple-browser://')
  await Command.execute('SimpleBrowser.setUrl', 'cookie-import-view:///firefox/default')

  const cookieImportView = Locator('.CookieImportView')
  await expect(cookieImportView).toBeVisible()
}
