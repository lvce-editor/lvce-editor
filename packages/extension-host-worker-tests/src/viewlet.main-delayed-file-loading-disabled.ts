import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-delayed-file-loading-disabled'

export const test: Test = async ({ Extension, Locator, Main, Settings, expect }) => {
  await Settings.update({
    'workbench.editor.showTabsWhileLoading': false,
  })
  await Extension.addWebExtension(new URL('../fixtures/sample.delayed-file-system-provider', import.meta.url).toString())
  const openPromise = Main.openUri('extension-host://delayed-files:///slow.txt')

  await new Promise((resolve) => setTimeout(resolve, 700))

  const tab = Locator('.MainTab[title$="slow.txt"]')
  const loading = Locator('.EditorContent--loading')
  await expect(tab).toBeHidden()
  await expect(loading).toBeHidden()

  await openPromise
  await expect(tab).toBeVisible()
}
