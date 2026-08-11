export const name = 'viewlet.main-same-file-mixed-layout'

export const test = async ({ Editor, FileSystem, Locator, Main, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/file.txt`
  await FileSystem.writeFile(uri, 'abc')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Main.splitRight()
  await Main.openUri(uri)
  await Main.splitDown()
  await Main.openUri(uri)
  await Main.splitRight()
  await Main.openUri(uri)
  const editors = Locator('.Editor')

  await Editor.setCursor(0, 3)
  await Editor.type('x')

  await expect(editors).toHaveCount(4)
  for (let index = 0; index < 4; index++) {
    await expect(editors.nth(index)).toHaveText('abcx')
  }
}
