import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-line-height-min-font-size'
const rowHeight30 = /^(?:-?\d+(?:\.\d+)?px )?30px$/ as unknown as string

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/line-height-min-font-size.txt`
  await FileSystem.writeFile(filePath, 'line 1\nline 2\nline 3')
  await Settings.update({ 'editor.fontSize': 18, 'editor.lineHeight': 10 })
  await FileSystem.writeFile('app:///settings.json', JSON.stringify({ 'editor.fontSize': 18, 'editor.lineHeight': 10 }))
  await Workspace.setUri(tmpDir)
  await Main.openUri(filePath)

  const editorRow = Locator('.EditorRow').first()
  const cursor = Locator('.EditorCursor')
  await expect(editorRow).toHaveCSS('height', '18px')
  await expect(cursor).toHaveCSS('height', '18px')

  await Settings.update({ 'editor.lineHeight': 24 })
  await FileSystem.writeFile('app:///settings.json', JSON.stringify({ 'editor.fontSize': 18, 'editor.lineHeight': 24 }))
  await Command.execute('Layout.handleSettingsChanged')
  await expect(editorRow).toHaveCSS('height', '24px')
  await expect(cursor).toHaveCSS('height', '24px')

  await Settings.update({ 'editor.fontSize': 30 })
  await FileSystem.writeFile('app:///settings.json', JSON.stringify({ 'editor.fontSize': 30, 'editor.lineHeight': 24 }))
  await Command.execute('Layout.handleSettingsChanged')
  await expect(editorRow).toHaveCSS('height', '30px')
  await expect(cursor).toHaveCSS('height', '30px')
  await Editor.setCursor(0, 0)
  await Editor.cursorDown()
  await expect(cursor).toHaveCSS('translate', rowHeight30)
}
