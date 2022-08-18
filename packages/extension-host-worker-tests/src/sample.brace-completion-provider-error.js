const name = 'sample.brace-completion-provider-error'

test.skip('sample.brace-completion-provider-error', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.xyz`, ``)

  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(
    new URL(`../fixtures/${name}`, import.meta.url).toString()
  )

  // act
  await Main.openUri(`${tmpDir}/test.xyz`)
  await Editor.setCursor(0, 0)
  await Editor.executeBraceCompletion('{')

  // // assert
  const overlayMessage = Locator('.EditorOverlayMessage')
  await expect(overlayMessage).toBeVisible()
  await expect(overlayMessage).toHaveText(
    'Error: Failed to execute brace completion provider: oops'
  )
})

export {}
