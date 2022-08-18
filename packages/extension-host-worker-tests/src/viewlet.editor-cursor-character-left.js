/// <reference path="../typings/types.d.ts" />

test('viewlet.editor-cursor-character-left', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)

  // act
  await Editor.setCursor(0, 1)

  // assert
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveCSS('left', '9px')

  // act
  await Editor.cursorCharacterLeft()

  // assert
  await expect(cursor).toHaveCSS('left', '0px')
})
