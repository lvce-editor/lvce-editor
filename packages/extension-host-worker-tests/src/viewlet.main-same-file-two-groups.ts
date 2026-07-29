export const name = 'viewlet.main-same-file-two-groups'

export const test = async ({ Editor, FileSystem, Locator, Main, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/file.txt`
  await FileSystem.writeFile(uri, 'abc')
  await Workspace.setPath(tmpDir)

  await Main.openUri(uri)
  await Main.splitRight()
  await Main.openUri(uri)

  const editors = Locator('.Editor')
  await expect(editors).toHaveCount(2)
  await expect(editors.nth(0)).toHaveText('abc')
  await expect(editors.nth(1)).toHaveText('abc')
  await Editor.shouldHaveText('abc')
}
