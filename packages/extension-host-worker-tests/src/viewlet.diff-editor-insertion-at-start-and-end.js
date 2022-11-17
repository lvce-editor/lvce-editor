test('sample.diff-editor-insertion-at-start-and-end', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file-1.txt`, `c`)
  await FileSystem.writeFile(
    `${tmpDir}/file-2.txt`,
    `a
b
c
d`
  )
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(`diff://${tmpDir}/file-1.txt<->${tmpDir}/file-2.txt`)

  // assert
  const contentLeft = Locator('.DiffEditorContentLeft')
  const contentRight = Locator('.DiffEditorContentRight')
  await expect(contentLeft).toHaveText('c')
  await expect(contentRight).toHaveText('abcd')
})
