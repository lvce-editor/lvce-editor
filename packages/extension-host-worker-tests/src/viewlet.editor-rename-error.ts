export const name = 'viewlet.editor-rename-error'

export const skip = true

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

  await Editor.openRename()
  const renameWidget = Locator('.EditorRename')
  await expect(renameWidget).toBeVisible()
  const renameInput = Locator('.RenameInputBox')
  await expect(renameInput).toBeVisible()

  // act

  // TODO
  // 1. type a value
  // 2. press enter
  // 3. verify an error message occurs

  // assert
}
