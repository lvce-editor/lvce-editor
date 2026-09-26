export const name = 'viewlet.main-editor-cursor-after-split-left'
export const skip = 1

export const test = async ({ Command, Editor, FileSystem, Locator, Main, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/file.txt`
  await FileSystem.writeFile(uri, '0123456789')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)

  await Command.execute('Main.splitLeft')
  await Main.openUri({ uri, reuseExisting: false })

  const editors = Locator('.Editor')
  await expect(editors).toHaveCount(2)
  await editors.nth(1).locator('.EditorRow').first().click({ position: { x: 80, y: 10 } })
  await Editor.type('X')

  await expect(editors.nth(1)).toHaveText('01234X56789')
}
