import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-html-empty-style-rendered'

export const test: Test = async ({ Editor, FileSystem, KeyBoard, Locator, Main, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/style.html`
  const html = '<html>\n  <head>\n    <style></style>\n  </head>\n</html>'
  await FileSystem.writeFile(filePath, html)
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)

  const styleRow = Locator('.EditorRow').nth(2)
  await expect(styleRow).toContainText('<style>')
  await expect(styleRow).toContainText('</style>')
  if ((await Editor.getText()) !== html) {
    throw new Error('The HTML document changed while rendering its empty style element')
  }

  await Editor.setCursor(2, 11)
  await KeyBoard.press('Enter')

  const openingTagRow = Locator('.EditorRow').nth(2)
  const closingTagRow = Locator('.EditorRow').nth(4)
  await expect(openingTagRow).toContainText('<style>')
  const htmlAfterEnter = await Editor.getText()
  if (!htmlAfterEnter.includes('<style>') || !htmlAfterEnter.includes('</style>')) {
    throw new Error(`Enter changed the HTML unexpectedly: ${JSON.stringify(htmlAfterEnter)}`)
  }
  await expect(closingTagRow).toContainText('</style>')
}
