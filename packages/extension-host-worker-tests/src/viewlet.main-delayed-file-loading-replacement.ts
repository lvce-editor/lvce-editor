import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-delayed-file-loading-replacement'

export const test: Test = async ({ Editor, Extension, Locator, Main, Settings, expect }) => {
  await Settings.update({
    'workbench.editor.showTabsWhileLoading': true,
  })
  await Extension.addWebExtension(new URL('../fixtures/sample.delayed-file-system-provider', import.meta.url).toString())
  const openPromise = Main.openUri('extension-host://delayed-files:///slow.txt')
  const loading = Locator('.EditorContent--loading')

  await new Promise((resolve) => setTimeout(resolve, 700))
  await expect(loading).toBeVisible()

  await openPromise

  await expect(loading).toBeHidden()
  await Editor.shouldHaveText('slow content')
}
