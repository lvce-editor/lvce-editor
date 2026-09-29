import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-language-mode-persistence'

export const test: Test = async ({ Editor, FileSystem, Main, QuickPick, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/script.txt`
  await FileSystem.writeFile(uri, 'const value = 1')
  await Workspace.setPath(tmpDir)
  await Main.closeAllEditors()
  await Main.openUri(uri)

  await QuickPick.open()
  await QuickPick.setValue('>Change Language Mode')
  await QuickPick.selectItem('Change Language Mode', {
    waitUntil: 'quickPick',
  })
  await QuickPick.setValue('javascript')
  await QuickPick.selectItem('javascript')

  await Main.closeAllEditors()
  await Main.openUri(uri)
  await Editor.setCursor(0, 0)
  await Editor.toggleLineComment()
  await Editor.shouldHaveText('// const value = 1')
}
