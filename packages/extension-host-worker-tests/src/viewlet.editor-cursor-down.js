/// <reference path="../typings/types.d.ts" />

test('viewlet.editor-cursor-down', async () => {
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
  await Editor.setCursor(0, 1)

  // assert
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveCSS('top', '0px')

  // act
  await Editor.cursorDown()

  // assert
  await expect(cursor).toHaveCSS('top', '20px')
})
