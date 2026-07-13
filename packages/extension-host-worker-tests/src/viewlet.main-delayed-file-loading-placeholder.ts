import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-delayed-file-loading-placeholder'

export const test: Test = async ({ Extension, Locator, Main, Settings, expect }) => {
  await Settings.update({
    'workbench.editor.showTabsWhileLoading': true,
  })
  await Extension.addWebExtension(new URL('../fixtures/sample.delayed-file-system-provider', import.meta.url).toString())
  const openPromise = Main.openUri('extension-host://delayed-files:///slow.txt')

  await new Promise((resolve) => setTimeout(resolve, 700))

  const loading = Locator('.EditorContent--loading')
  await expect(loading).toBeVisible()
  await expect(loading).toHaveText('Loading...')

  await openPromise
}
