/// <reference path="../typings/types.d.ts" />

test('viewlet.editor-copy-line-down', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file1.txt`)

  // act
  await Editor.setCursor(0, 0)
  await Editor.copyLineDown()

  const editor = Locator('.Editor')
  await expect(editor).toHaveText('content 1content 1')
})
