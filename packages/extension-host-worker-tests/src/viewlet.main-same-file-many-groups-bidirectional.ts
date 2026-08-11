export const name = 'viewlet.main-same-file-many-groups-bidirectional'

export const test = async ({ Editor, FileSystem, Locator, Main, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/file.txt`
  await FileSystem.writeFile(uri, 'abc')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  for (let index = 1; index < 10; index++) {
    await Main.splitRight()
    await Main.openUri({ uri, reuseExisting: false })
  }
  const editors = Locator('.Editor')

  await editors.nth(0).click()
  await Editor.setCursor(0, 0)
  await Editor.type('left-')
  await editors.nth(9).click()
  await Editor.setCursor(0, 8)
  await Editor.type('-right')

  await expect(editors).toHaveCount(10)
  for (let index = 0; index < 10; index++) {
    await expect(editors.nth(index)).toHaveText('left-abc-right')
  }
}
