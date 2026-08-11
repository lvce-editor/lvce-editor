export const name = 'viewlet.main-same-file-multiline-edit'

export const test = async ({ Editor, FileSystem, Locator, Main, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/file.txt`
  await FileSystem.writeFile(uri, 'abc')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Main.splitRight()
  await Main.openUri({ uri, reuseExisting: false })
  const editors = Locator('.Editor')

  await Editor.setCursor(0, 3)
  await Editor.insertLineBreak()
  await Editor.type('def')

  await expect(editors.nth(0).locator('.EditorRow')).toHaveCount(2)
  await expect(editors.nth(1).locator('.EditorRow')).toHaveCount(2)
  await expect(editors.nth(0)).toHaveText('abcdef')
  await expect(editors.nth(1)).toHaveText('abcdef')
}
