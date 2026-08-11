export const name = 'viewlet.main-same-file-delete'

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
  await Editor.deleteCharacterLeft()

  await expect(editors.nth(0)).toHaveText('ab')
  await expect(editors.nth(1)).toHaveText('ab')
}
