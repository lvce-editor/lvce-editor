const name = 'sample.source-control-provider-error-invalid-return-value-array-of-strings'

test('sample.source-control-provider-error-invalid-return-value-array-of-strings', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())

  // act
  await SideBar.open('Source Control')

  // assert
  const sourceControl = Locator('.SourceControl')
  // TODO error message could be improved: Failed to query changed files from test-source-control-provider: changedFile must be of type object but was file-1.txt
  // or filter out invalid items and print warning message in console
  await expect(sourceControl).toHaveText(`TypeError: Cannot read properties of undefined (reading 'toLowerCase')`)
})

export {}
