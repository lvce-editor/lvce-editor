const name = 'sample.brace-completion-provider'

test.skip('sample.brace-completion-provider', async () => {
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

  // assert
  const editor = Locator('.Viewlet.Editor')
  await expect(editor).toHaveText(`{}`)
})

export {}
