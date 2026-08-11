export const name = 'viewlet.main-same-file-one-hundred-groups-vertical'

export const test = async ({ Editor, FileSystem, Locator, Main, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/file.txt`
  await FileSystem.writeFile(uri, 'abc')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  for (let index = 1; index < 100; index++) {
    await Main.splitDown()
    await Main.openUri({ uri, reuseExisting: false })
  }
  const editors = Locator('.Editor')

  await Editor.setCursor(0, 3)
  await Editor.type('x')

  await expect(editors).toHaveCount(100)
  for (let index = 0; index < 100; index++) {
    await expect(editors.nth(index)).toHaveText('abcx')
  }
}
