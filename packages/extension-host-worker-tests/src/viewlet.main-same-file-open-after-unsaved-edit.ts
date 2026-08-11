export const name = 'viewlet.main-same-file-open-after-unsaved-edit'

export const test = async ({ Editor, FileSystem, Locator, Main, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/file.txt`
  await FileSystem.writeFile(uri, 'abc')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Editor.setCursor(0, 3)
  await Editor.type('x')

  await Main.splitRight()
  await Main.openUri({ uri, reuseExisting: false })

  const editors = Locator('.Editor')
  await expect(editors).toHaveCount(2)
  await expect(editors.nth(0)).toHaveText('abcx')
  await expect(editors.nth(1)).toHaveText('abcx')
}
