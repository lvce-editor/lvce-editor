import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.simple-browser-suggestion-snapshot'

// The standard e2e runner is browser-only; this view requires Electron WebContentsView.
export const skip = process.env.RUN_SIMPLE_BROWSER_SUGGESTIONS_E2E === '1' ? 0 : 1

export const test: Test = async ({ Command, expect, Locator, Settings }) => {
  await Settings.update({ 'simpleBrowser.suggestions': true })
  await Command.execute('LocalStorage.setJson', 'simple-browser-search-history', ['cheeseburger'])
  await Command.execute('Layout.showPreview', 'simple-browser://')
  await Command.execute('SimpleBrowser.handleInput', 'cheese')

  const snapshot = Locator('.SimpleBrowserSnapshotSearchSuggestions')
  await expect(snapshot).toBeVisible()
  for (const query of ['unmatched', 'unmatched query', 'unmatched query continued']) {
    await Command.execute('SimpleBrowser.handleInput', query)
    await expect(snapshot).toBeVisible()
    await expect(Locator(`.SimpleBrowserSuggestion[data-value="${query}"]`)).toBeVisible()
  }
  await Command.execute('SimpleBrowser.handleAddressBlur')
  await expect(snapshot).toHaveCount(0)
}
