test('viewlet.editor-auto-close-quotes', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, ``)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)

  // act
  await Editor.setCursor(0, 0)

  // assert
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveCSS('top', '0px')

  // act
  await Editor.type('"')

  // assert
  await expect(cursor).toHaveCSS('left', '9px')
  const editor = Locator('.Editor')
  await expect(editor).toHaveText('""')

  // act
  await Editor.deleteLeft()
  await expect(cursor).toHaveCSS('left', '0px')
  await expect(editor).toHaveText('')
})
