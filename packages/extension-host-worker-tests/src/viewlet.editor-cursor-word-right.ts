export const name = 'viewlet.editor-cursor-word-right'

export const skip = 1

export const test = async ({ FileSystem, Workspace, Main, Editor, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `<title>Document</title>`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)

  // act
  await Editor.setCursor(0, 7)

  // assert
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveCSS('translate', /^(63|64|65|66|67|68|69).*?px$/)

  // act
  await Editor.cursorWordRight()

  // assert
  await expect(cursor).toHaveCSS('translate', /^(134|135|136|137|138|139|140|141|142|143|144|145|146).*?px$/)
}
