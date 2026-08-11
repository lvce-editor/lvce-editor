export const name = 'viewlet.main-same-file-undo-redo'

export const test = async ({ Command, Editor, FileSystem, Locator, Main, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/file.txt`
  await FileSystem.writeFile(uri, 'abc')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Main.splitRight()
  await Main.openUri({ uri, reuseExisting: false })
  const editors = Locator('.Editor')

  await Editor.setCursor(0, 3)
  await Editor.type('x')
  await editors.nth(0).click()
  await Command.execute('Editor.undo')
  await expect(editors.nth(0)).toHaveText('abc')
  await expect(editors.nth(1)).toHaveText('abc')
  await Command.execute('Editor.redo')

  await expect(editors.nth(0)).toHaveText('abcx')
  await expect(editors.nth(1)).toHaveText('abcx')
}
