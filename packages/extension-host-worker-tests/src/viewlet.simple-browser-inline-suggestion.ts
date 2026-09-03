import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.simple-browser-inline-suggestion'

// The standard e2e runner is browser-only; this view requires Electron WebContentsView.
export const skip = process.env.RUN_SIMPLE_BROWSER_SUGGESTIONS_E2E === '1' ? 0 : 1

export const test: Test = async ({ Command, expect, Locator, Settings }) => {
  await Settings.update({ 'simpleBrowser.suggestions': true })
  await Command.execute('LocalStorage.setJson', 'simple-browser-search-history', ['cheeseburger'])
  await Command.execute('Layout.showPreview', 'simple-browser://')

  const input = Locator('.SimpleBrowserHeader input.InputBox')
  await Command.execute('SimpleBrowser.handleInput', 'cheese')

  await expect(input).toHaveValue('cheese')
  await expect(Locator('.SimpleBrowserInlineSuggestion')).toHaveAttribute('data-value', 'cheeseburger')
}
