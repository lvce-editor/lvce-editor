import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'editor.completion-popup-width'

export const test: Test = async ({ Command, Editor, expect, Extension, FileSystem, Locator, Main, Workspace }) => {
  await Extension.addWebExtension(import.meta.resolve('../fixtures/editor.completion-popup-width'))
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.xyz`, ' '.repeat(100))
  await Workspace.setUri(tmpDir)
  await Main.openUri(`${tmpDir}/file.xyz`)
  const popup = Locator('.EditorCompletion')
  const resize = async (width: number): Promise<void> => {
    await Command.execute('Editor.resize', { x: 100, y: 100, width, height: 400 })
  }

  await resize(800)
  await Editor.setCursor(0, 0)
  await Editor.openCompletion()
  await expect(popup).toHaveCSS('width', '273px')
  await expect(popup).toHaveCSS('left', '100px')
  await expect(Locator('.EditorCompletionItem')).toHaveText('window.titleBarStyle')
  await Editor.closeCompletion()

  await resize(180)
  await Editor.openCompletion()
  await expect(popup).toHaveCSS('width', '180px')
  await expect(popup).toHaveCSS('left', '100px')
  await Editor.closeCompletion()

  await resize(800)
  await Editor.setCursor(0, 90)
  await Editor.openCompletion()
  await expect(popup).toHaveCSS('width', '273px')
  await expect(popup).toHaveCSS('left', '627px')
  await Editor.closeCompletion()

  await Editor.setCursor(0, 0)
  await Editor.openCompletion()
  await Editor.type('wi')
  await expect(popup).toHaveCSS('width', '273px')
  await Editor.deleteCharacterLeft()
  await expect(popup).toHaveCSS('width', '273px')
  await Locator('.EditorCompletionItem').click()
  await expect(popup).toBeHidden()
  const text = await Editor.getText()
  if (!text.startsWith('window.titleBarStyle')) throw new Error(`Unexpected completion text: ${text}`)
}
