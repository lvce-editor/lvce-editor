import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.simple-browser-search-history-suggestion'

// The standard e2e runner is browser-only; this view requires Electron WebContentsView.
export const skip = process.env.RUN_SIMPLE_BROWSER_SUGGESTIONS_E2E === '1' ? 0 : 1

export const test: Test = async ({ Command, expect, Locator, Settings }) => {
  await Settings.update({ 'simpleBrowser.suggestions': true })
  await Command.execute('Layout.showPreview', 'simple-browser://')
  const input = Locator('.SimpleBrowserHeader input.InputBox')

  await Command.execute('SimpleBrowser.handleInput', 'cheeseburger')
  await Command.execute('SimpleBrowser.go')
  await Command.execute('SimpleBrowser.handleInput', 'cheese')

  const historySuggestion = Locator('.SimpleBrowserSuggestion[data-value="cheeseburger"]')
  await expect(historySuggestion).toBeVisible()
  await historySuggestion.click()
  await expect(input).toHaveValue('cheeseburger')
}
