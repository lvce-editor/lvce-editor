const name = 'sample.formatting-provider'

test('sample.formatting-provider', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, `a`)
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(
    new URL(`../fixtures/${name}`, import.meta.url).toString()
  )
  await Main.openUri(`${tmpDir}/test.xyz`)

  // act
  await Editor.format()

  // assert
  const editorRow = Locator('.EditorRow')
  await expect(editorRow).toHaveText('b')
})

export {}
