import type { Test } from '@lvce-editor/test-with-playwright'

// cspell:ignore soundcloud

export const name = 'viewlet.cookie-import-view-open'

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Main.openUri', 'cookie-import-view:///firefox/default')

  const root = Locator('.CookieImportView')
  await expect(root).toBeVisible()
  await expect(root.locator('h1')).toHaveText('Import Firefox Cookies')
  await expect(root.locator('#CookieImportBrowser')).toHaveValue('Firefox')
  await expect(root.locator('#CookieImportProfile')).toHaveValue('Default profile')
  await expect(root.locator('#CookieImportWebsite')).toHaveAttribute('placeholder', 'soundcloud.com')
  await expect(root.locator('button')).toHaveCount(2)
}
