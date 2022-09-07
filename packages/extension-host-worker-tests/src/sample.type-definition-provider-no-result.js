const name = 'sample.type-definition-provider-no-result'

test('sample.type-definition-provider-no-result', async () => {
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
  await Editor.goToTypeDefinition()

  // assert
  const overlayMessage = Locator('.EditorOverlayMessage')
  await expect(overlayMessage).toBeVisible()
  await expect(overlayMessage).toHaveText('No type definition found')
})

export {}
