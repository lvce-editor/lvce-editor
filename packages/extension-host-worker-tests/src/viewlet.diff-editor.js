test('sample.diff-editor', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file-1.txt`, `abc`)
  await FileSystem.writeFile(`${tmpDir}/file-2.txt`, `def`)
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(`diff://${tmpDir}/file-1.txt<->${tmpDir}/file-2.txt`)

  // assert
  const contentLeft = Locator('.DiffEditorContentLeft')
  const contentRight = Locator('.DiffEditorContentRight')
  await expect(contentLeft).toHaveText('abc')
  await expect(contentRight).toHaveText('def')
})
