const name = 'sample.definition-provider-error'

test('sample.definition-provider-error', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.xyz`,
    `export const add = () => {
  return a + b
}

add(1, 2)
    `
  )
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(
    new URL(`../fixtures/${name}`, import.meta.url).toString()
  )
  await Main.openUri(`${tmpDir}/test.xyz`)
  await Editor.setCursor(0, 0)

  // act
  await Editor.goToDefinition()

  // assert
  const overlayMessage = Locator('.EditorOverlayMessage')
  await expect(overlayMessage).toBeVisible()
  await expect(overlayMessage).toHaveText(
    'Error: Failed to execute type definition provider: oops'
  )
})

export {}
