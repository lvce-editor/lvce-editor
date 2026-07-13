import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-delayed-file-loading-fast-path'

export const test: Test = async ({ Editor, Extension, FileSystem, Locator, Main, Settings, expect }) => {
  await Settings.update({
    'workbench.editor.showTabsWhileLoading': false,
  })
  const tmpDir = await FileSystem.getTmpDir()
  const warmupFile = `${tmpDir}/warmup.txt`
  await FileSystem.writeFile(warmupFile, 'warmup')
  await Main.openUri(warmupFile)
  await Main.closeAllEditors()

  await Settings.update({
    'workbench.editor.showTabsWhileLoading': true,
  })
  await Extension.addWebExtension(new URL('../fixtures/sample.delayed-file-system-provider', import.meta.url).toString())
  const fastFile = 'extension-host://delayed-files:///fast.txt'
  await FileSystem.readFile(fastFile)
  const openPromise = Main.openUri(fastFile)

  await new Promise((resolve) => setTimeout(resolve, 250))

  const loading = Locator('.EditorContent--loading')
  await expect(loading).toBeHidden()

  await openPromise
  await Editor.shouldHaveText('fast content')
}
