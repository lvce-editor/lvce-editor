const name = 'sample.debug-provider-error-not-found'

test('sample.debug-provider-error-not-found', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(
    new URL(`../fixtures/${name}`, import.meta.url).toString()
  )

  // act
  await SideBar.open('Run And Debug')

  // assert
  const runAndDebug = Locator('.RunAndDebug')
  await expect(runAndDebug).toHaveText(
    'Error: Failed to execute debug provider: no debug provider "test-debug" found'
  )
})

export {}
