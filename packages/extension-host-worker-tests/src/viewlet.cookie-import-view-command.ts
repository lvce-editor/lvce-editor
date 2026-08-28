import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.cookie-import-view-command'

export const test: Test = async ({ expect, Locator, QuickPick }) => {
  await QuickPick.open()
  await QuickPick.setValue('>Import Cookies from Firefox')
  await QuickPick.selectItem('Simple Browser: Import Cookies from Firefox')

  await expect(Locator('.CookieImportView')).toBeVisible()
  const tab = Locator('.MainTab[title="cookie-import-view:///"]')
  await expect(tab).toBeVisible()
  await expect(tab.locator('.TabTitle')).toHaveText('Import Firefox Cookies')
}
