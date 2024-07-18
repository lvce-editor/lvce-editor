export const skip = true

export const name = 'viewlet.main-open-side-by-side'

export const test = async ({ FileSystem, Workspace, Main, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file-1.txt`, `abc`)
  await FileSystem.writeFile(`${tmpDir}/file-2.txt`, `def`)
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(`${tmpDir}/file-1.txt`)
  await Main.splitRight()
  await Main.openUri(`${tmpDir}/file-2.txt`)

  // assert
  const editors = await Locator('.Editor')
  await expect(editors).toHaveCount(2)
  const editorLeft = editors.nth(0)
  await expect(editorLeft).toHaveText('abc')
  const editorRight = editors.nth(1)
  await expect(editorRight).toHaveText('def')
}
