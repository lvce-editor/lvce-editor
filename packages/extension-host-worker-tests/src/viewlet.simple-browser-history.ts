import type { Test } from '@lvce-editor/test-with-playwright'

const nonZeroPixelWidthRegex = /^[1-9]\d*(?:\.\d+)?px$/

export const name = 'viewlet.simple-browser-history'

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('LocalStorage.setJson', 'simple-browser-history', [
    { date: Date.UTC(2026, 8, 2, 11, 15), url: 'https://older.example' },
    { date: Date.UTC(2026, 8, 3, 12, 30), url: 'https://newer.example/docs' },
  ])
  await Command.execute('Main.openUri', 'simple-browser-history://')

  const historyView = Locator('.SimpleBrowserHistory')
  await expect(historyView).toBeVisible()
  await expect(historyView).toHaveCSS('width', nonZeroPixelWidthRegex as unknown as string)
  await expect(historyView.locator('h1')).toHaveText('History')
  await expect(historyView.locator('input')).toHaveAttribute('placeholder', 'Search history')
  const entries = historyView.locator('.SimpleBrowserHistoryEntry')
  await expect(entries).toHaveCount(2)
  await expect(entries.nth(0).locator('.SimpleBrowserHistoryUrl')).toHaveText('https://newer.example/docs')
  await expect(entries.nth(1).locator('.SimpleBrowserHistoryUrl')).toHaveText('https://older.example')

  await entries.nth(0).locator('.SimpleBrowserHistoryRemove').click()
  await expect(entries).toHaveCount(1)
  await expect(entries.locator('.SimpleBrowserHistoryUrl')).toHaveText('https://older.example')

  await historyView.locator('.SimpleBrowserHistoryControls button').click()
  await expect(entries).toHaveCount(0)
}
