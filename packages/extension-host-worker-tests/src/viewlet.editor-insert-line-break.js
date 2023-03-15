export const name = 'viewlet.editor-insert-line-break'

export const test = async ({ FileSystem, Workspace, Extension, Main, Editor, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.xyz`, `{}`)
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())
  await Main.openUri(`${tmpDir}/file.xyz`)
  await Editor.setCursor(0, 1)
  await Editor.insertLineBreak()

  // assert
  const rows = Locator('.EditorRow')
  await expect(rows).toHaveCount(3)
  await expect(rows.nth(0)).toHaveText('{')
  await expect(rows.nth(1)).toHaveText('  ')
  await expect(rows.nth(2)).toHaveText('}')
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveCSS('translate', /^(18|19|20).*?px$/)
}
