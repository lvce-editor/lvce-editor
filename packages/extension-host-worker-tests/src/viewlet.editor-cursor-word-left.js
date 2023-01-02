test('viewlet.editor-cursor-word-left', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, `<title>Document</title>`)
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)

  // act
  await Editor.setCursor(0, 15)

  // assert
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toHaveCSS('left', /^(134px|135px|136px|137px|138px|139px|140px|141px|142px)$/)

  // act
  await Editor.cursorWordLeft()

  // assert
  await expect(cursor).toHaveCSS('left', /^(63px|64px|65px|66px)$/)
})
