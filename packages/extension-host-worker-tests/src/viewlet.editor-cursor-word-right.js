test('viewlet.editor-cursor-word-right', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `<title>Document</title>`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)

  // act
  await Editor.setCursor(0, 7)

  // assert
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveCSS('left', /^(63px|64px|65px|66px|67px)$/)

  // act
  await Editor.cursorWordRight()

  // assert
  await expect(cursor).toHaveCSS('left', /^(134px|135px|136px|137px|138px|139px|140px|141px|142px|143px)$/)
})
