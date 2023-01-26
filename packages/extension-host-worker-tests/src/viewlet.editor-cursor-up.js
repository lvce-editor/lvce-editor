export const name = 'viewlet.editor-cursor-up'

export const test = async ({ FileSystem, Workspace, Main, Editor, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/file1.txt`,
    `content 1
content 2`
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)

  // act
  await Editor.setCursor(1, 1)

  // assert
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveCSS('translate', /^(6|7|8|9|10).*?px 20px$/)

  // act
  await Editor.cursorUp()

  // assert
  await expect(cursor).toHaveCSS('translate', /^(6|7|8|9|10).*?px$/)
}
