import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-save-extension-filesystem'

export const test: Test = async ({ Editor, Extension, FileSystem, Main, Workspace }) => {
  await Workspace.openTmpDir()
  const extensionUri = new URL('../fixtures/sample.filesystem-save', import.meta.url).toString().replace(/\/$/, '')
  await Extension.addWebExtension(extensionUri)
  await Extension.enableWorkspace('sample.filesystem-save')
  const uri = 'save-test:///note.txt'
  await Main.openUri(uri)
  await Editor.shouldHaveText('before save')
  await Editor.setText('saved through the extension filesystem')
  await Main.save()
  await FileSystem.shouldHaveFile(uri, 'saved through the extension filesystem')
  await Editor.shouldHaveText('saved through the extension filesystem')
}
