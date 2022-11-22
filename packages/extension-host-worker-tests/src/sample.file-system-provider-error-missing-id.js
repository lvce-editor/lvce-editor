test('viewlet.file-system-provider-error-missing-id', async () => {
  // arrange
  await Extension.addWebExtension(
    new URL(
      '../fixtures/sample.file-system-provider-error-missing-id',
      import.meta.url
    ).toString()
  )
  const tmpDir = `extension-host://xyz://folder`

  // act
  // await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/file-1.txt`)
})
