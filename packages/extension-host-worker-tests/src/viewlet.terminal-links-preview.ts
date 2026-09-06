import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.terminal-links-preview'

// Simple Browser requires Electron WebContentsView; the standard runner is browser-only.
export const skip = 1

export const test: Test = async ({ Command, KeyBoard, Locator, Settings, expect }) => {
  await Settings.update({ 'terminal.backend': 'mock' })
  await Command.execute('Layout.hidePreview')
  await Command.execute('Layout.showPanel', 'Terminals')

  const terminal = Locator('.XtermTerminal')
  await expect(terminal).toBeVisible()
  const uri = 'http://localhost:3333/'
  for (const char of `echo ${uri}`) {
    await KeyBoard.press(char === ' ' ? 'Space' : char)
  }
  await KeyBoard.press('Enter')

  const link = Locator('.XtermTerminal .xterm-rows span', { hasText: uri }).nth(1)
  await expect(link).toBeVisible()
  await link.hover()
  await link.click()

  const browser = Locator('.PreviewArea .SimpleBrowser')
  await expect(browser).toBeVisible()
  const tabs = browser.locator('.SimpleBrowserTab')
  const address = browser.locator('input[name="simple-browser-address"]')
  await expect(address).toHaveValue(uri)
  await expect(tabs).toHaveCount(2)

  await link.hover()
  await link.click()
  await expect(tabs).toHaveCount(3)
  await expect(address).toHaveValue(uri)
}
