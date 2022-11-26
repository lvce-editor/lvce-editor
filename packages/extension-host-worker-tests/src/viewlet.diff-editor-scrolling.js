const getContent = () => {
  let content = ''
  for (let i = 97; i < 160; i++) {
    content += String.fromCharCode(i) + '\n'
  }
  return content
}

test('sample.diff-editor-insertion', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file-1.txt`, ``)
  await FileSystem.writeFile(`${tmpDir}/file-2.txt`, getContent())
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(`diff://${tmpDir}/file-1.txt<->${tmpDir}/file-2.txt`)

  // assert
  const contentLeft = Locator('.DiffEditorContentLeft')
  const contentRight = Locator('.DiffEditorContentRight')
  // await expect(contentLeft).toHaveText('')
  // await expect(contentRight).toHaveText('def')
  // const rowLeft = contentLeft.locator('.EditorRow')
  // await expect(rowLeft).toHaveClass('Deletion')
  // const rowRight = contentRight.locator('.EditorRow')
  // await expect(rowRight).toHaveClass('Insertion')
})
