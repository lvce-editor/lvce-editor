export const name = 'viewlet.main-same-file-many-groups-isolate-other-file'

export const test = async ({ Editor, FileSystem, Locator, Main, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/file.txt`
  const otherUri = `${tmpDir}/other.txt`
  await FileSystem.writeFile(uri, 'abc')
  await FileSystem.writeFile(otherUri, 'other')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Main.splitRight()
  await Main.openUri(uri)
  await Main.splitDown()
  await Main.openUri(uri)
  await Main.splitRight()
  await Main.openUri(otherUri)
  const editors = Locator('.Editor')

  await editors.nth(1).click()
  await Editor.setCursor(0, 3)
  await Editor.type('x')

  await expect(editors).toHaveCount(4)
  await expect(editors.nth(0)).toHaveText('abcx')
  await expect(editors.nth(1)).toHaveText('abcx')
  await expect(editors.nth(2)).toHaveText('abcx')
  await expect(editors.nth(3)).toHaveText('other')
}
