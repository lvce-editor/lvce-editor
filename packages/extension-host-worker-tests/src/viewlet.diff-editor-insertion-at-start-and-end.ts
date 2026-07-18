export const name = 'sample.diff-editor-insertion-at-start-and-end'

export const test = async ({ FileSystem, Workspace, Main, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file-1.txt`, `c`)
  await FileSystem.writeFile(
    `${tmpDir}/file-2.txt`,
    `a
b
c
d`,
  )
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(`diff://${tmpDir}/file-1.txt<->${tmpDir}/file-2.txt`)

  // assert
  const contentLeft = Locator('.DiffEditorContentLeft .DiffEditorRows')
  const contentRight = Locator('.DiffEditorContentRight .DiffEditorRows')
  await expect(contentLeft).toHaveText('c')
  await expect(contentRight).toHaveText('abcd')
}
