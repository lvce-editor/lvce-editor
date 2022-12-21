const name = 'sample.debug-provider-scope'

test('sample.debug-provider-scope', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(
    new URL(`../fixtures/${name}`, import.meta.url).toString()
  )

  // act
  await SideBar.open('Run And Debug')

  // await Editor.goToDefinition()

  // // assert
  // const overlayMessage = Locator('.EditorOverlayMessage')
  // await expect(overlayMessage).toBeVisible()
  // await expect(overlayMessage).toHaveText(
  //   'Error: Failed to execute definition provider: oops'
  // )
})

export {}
