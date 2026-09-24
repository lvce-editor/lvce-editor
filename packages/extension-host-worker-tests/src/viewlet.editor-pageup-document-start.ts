import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-pageup-document-start'

export const test: Test = async ({ Editor, FileSystem, KeyBoard, Locator, Main, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/file.txt`
  const lines = Array.from({ length: 60 }, (_, index) => `line ${String(index).padStart(2, '0')}`)
  await FileSystem.writeFile(filePath, lines.join('\n'))
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)
  const originalText = await Editor.getText()

  await Editor.setCursor(59, lines[59].length)
  await Editor.setDeltaY(600)

  const cursor = Locator('.EditorCursor')
  await expect(cursor).toBeVisible()

  await KeyBoard.press('PageUp')

  await expect(cursor).toBeVisible()
  await expect(cursor).toHaveCSS('translate', '0px')
  await expect(Locator('.EditorRow').first()).toContainText('line 00')

  await KeyBoard.press('PageUp')
  await expect(cursor).toBeVisible()
  await expect(cursor).toHaveCSS('translate', '0px')
  if ((await Editor.getText()) !== originalText) {
    throw new Error('PageUp changed the document contents')
  }

  const emptyFilePath = `${tmpDir}/empty.txt`
  await FileSystem.writeFile(emptyFilePath, '')
  await Main.openUri(emptyFilePath)
  await KeyBoard.press('PageUp')
  await KeyBoard.press('PageUp')
  await expect(Locator('.EditorCursor')).toBeVisible()
  await expect(Locator('.EditorCursor')).toHaveCSS('translate', '0px')
}
