import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.simple-browser-tab-pointerdown'

// The standard e2e runner is browser-only; this view requires Electron WebContentsView.
export const skip = 1

export const test: Test = async ({ Command, Locator, expect, Settings }) => {
  await Settings.update({ 'simpleBrowser.tabs.enabled': true })
  await Command.execute('Layout.showPreview', 'simple-browser://')
  await Command.execute('SimpleBrowser.createNewTab')

  const firstTab = Locator('.SimpleBrowserTab').nth(0)
  const secondTab = Locator('.SimpleBrowserTab').nth(1)
  await expect(secondTab).toHaveAttribute('aria-selected', 'true')

  // Pressing the close button on a background tab must not activate it.
  await firstTab.locator('.SimpleBrowserTabClose').dispatchEvent('pointerdown', { bubbles: true, button: 0 } as unknown as string)
  await expect(secondTab).toHaveAttribute('aria-selected', 'true')

  // Check selection before dispatching pointerup or click.
  await firstTab.locator('.SimpleBrowserTabTitle').dispatchEvent('pointerdown', { bubbles: true, button: 0 } as unknown as string)
  await expect(firstTab).toHaveAttribute('aria-selected', 'true')
  await expect(secondTab).toHaveAttribute('aria-selected', 'false')
}
