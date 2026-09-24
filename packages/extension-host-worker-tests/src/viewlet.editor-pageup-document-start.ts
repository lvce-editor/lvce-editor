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
  const startingSelections = await Editor.getSelections()
  if (startingSelections[0] !== 59 || startingSelections[1] !== lines[59].length) {
    throw new Error('The starting cursor is not on a later line at a nonzero column')
  }

  const cursor = Locator('.EditorCursor')
  await expect(cursor).toBeVisible()

  await KeyBoard.press('PageUp')

  await expect(cursor).toBeVisible()
  await expect(cursor).toHaveCSS('translate', '0px')
  await expect(Locator('.EditorRow').first()).toContainText('line 00')
  const firstPageUpSelections = await Editor.getSelections()
  if (firstPageUpSelections[0] !== 0 || firstPageUpSelections[1] !== 0) {
    throw new Error('PageUp did not move the cursor to document position 0/0')
  }

  await KeyBoard.press('PageUp')
  await expect(cursor).toBeVisible()
  await expect(cursor).toHaveCSS('translate', '0px')
  const repeatedPageUpSelections = await Editor.getSelections()
  if (repeatedPageUpSelections[0] !== 0 || repeatedPageUpSelections[1] !== 0) {
    throw new Error('Repeated PageUp moved the cursor away from document position 0/0')
  }
  if ((await Editor.getText()) !== originalText) {
    throw new Error('PageUp changed the document contents')
  }

  const emptyFilePath = `${tmpDir}/empty.txt`
  await FileSystem.writeFile(emptyFilePath, '')
  await Main.openUri(emptyFilePath)
  await KeyBoard.press('PageUp')
  await KeyBoard.press('PageUp')
  const emptyCursor = Locator('.EditorCursor')
  await expect(emptyCursor).toBeVisible()
  await expect(emptyCursor).toHaveCSS('translate', '0px')
  const emptySelections = await Editor.getSelections()
  if (emptySelections[0] !== 0 || emptySelections[1] !== 0) {
    throw new Error('Repeated PageUp moved the empty-document cursor away from 0/0')
  }
}
