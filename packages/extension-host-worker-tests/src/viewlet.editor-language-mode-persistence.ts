import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-language-mode-persistence'

export const test: Test = async ({ expect, FileSystem, Locator, Main, QuickPick, Workspace }) => {
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

  const keywordToken = Locator('.Token.Keyword', { hasText: 'const' })
  await expect(keywordToken).toBeVisible()

  await Main.closeAllEditors()
  await Main.openUri(uri)
  await expect(keywordToken).toBeVisible()
}
