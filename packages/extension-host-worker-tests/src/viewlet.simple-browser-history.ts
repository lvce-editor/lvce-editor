import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.simple-browser-history'

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('Main.openUri', 'simple-browser-history://')

  const historyView = Locator('.SimpleBrowserHistory')
  await expect(historyView).toBeVisible()
  await expect(historyView.locator('h1')).toHaveText('History')
  await expect(historyView.locator('input')).toHaveAttribute('placeholder', 'Search history')
  await expect(historyView.locator('button')).toHaveText('Clear history')
}
