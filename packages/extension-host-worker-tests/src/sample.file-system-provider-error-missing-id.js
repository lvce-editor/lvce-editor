test('sample.file-system-provider-error-missing-id', async () => {
  // arrange
  await Extension.addWebExtension(
    new URL(
      '../fixtures/sample.file-system-provider-error-missing-id',
      import.meta.url
    ).toString()
  )
  const tmpDir = `extension-host://xyz://folder`

  // act
  await Main.openUri(`${tmpDir}/file-1.txt`)

  // TODO verify that error message is displayed in editor
})
