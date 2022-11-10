const name = 'sample.formatting-provider-error-invalid-return-value-string'

test('sample.formatting-provider-error-invalid-return-value-string', async () => {
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
  const overlayMessage = Locator('.EditorOverlayMessage')
  await expect(overlayMessage).toBeVisible()
  // TODO improve error message
  // TODO error message should be shorted
  // TODO verify that correct error stack and codeFrame is printed in console
  await expect(overlayMessage).toHaveText(
    'Error: Failed to execute formatting provider: VError: invalid formatting result: formatting must be of type array but is '
  )
})

export {}
