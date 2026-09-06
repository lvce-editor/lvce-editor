import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.terminal-links-preview'

// Simple Browser requires Electron WebContentsView; the standard runner is browser-only.
export const skip = 1

export const test: Test = async ({ Command, Locator, Settings, expect }) => {
  await Settings.update({ 'terminal.backend': 'mock' })
  await Command.execute('Layout.hidePreview')
  await Command.execute('Layout.showPanel', 'Terminals')

  const terminal = Locator('.XtermTerminal')
  await expect(terminal).toBeVisible()
  const uri = 'http://localhost:3333/'
  await Command.execute('Terminal2.handleLink', uri)

  const browser = Locator('.PreviewArea .SimpleBrowser')
  await expect(browser).toBeVisible()
  const tabs = browser.locator('.SimpleBrowserTab')
  const address = browser.locator('input[name="simple-browser-address"]')
  await expect(address).toHaveValue(uri)
  await expect(tabs).toHaveCount(2)

  await Command.execute('Terminal2.handleLink', uri)
  await expect(tabs).toHaveCount(3)
  await expect(address).toHaveValue(uri)
}
