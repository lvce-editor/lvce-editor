export const name = 'viewlet.editor-rename'

export const test = async ({ FileSystem, Workspace, Main, Editor, Locator, expect, FindWidget }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file.js`,
    `let x = 1
`,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file.js`)
  await Editor.setCursor(0, 5)

  // act
  await Editor.openRename()

  // assert
  const renameWidget = Locator('.EditorRename')
  await expect(renameWidget).toBeVisible()
  const renameInput = Locator('.RenameInputBox')
  await expect(renameInput).toBeVisible()

  // TODO
  // await expect(renameInput).toBeFocused()
}
