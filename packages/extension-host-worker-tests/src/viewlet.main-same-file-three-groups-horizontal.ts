export const name = 'viewlet.main-same-file-three-groups-horizontal'

export const test = async ({ Editor, FileSystem, Locator, Main, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/file.txt`
  await FileSystem.writeFile(uri, 'abc')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Main.splitRight()
  await Main.openUri({ uri, reuseExisting: false })
  await Main.splitRight()
  await Main.openUri({ uri, reuseExisting: false })
  const editors = Locator('.Editor')

  await editors.nth(1).click()
  await Editor.setCursor(0, 3)
  await Editor.type('x')

  await expect(editors).toHaveCount(3)
  for (let index = 0; index < 3; index++) {
    await expect(editors.nth(index)).toHaveText('abcx')
  }
}
