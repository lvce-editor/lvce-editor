test('sample.type-definition-provider-not-registered', async () => {
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
  await Main.openUri(`${tmpDir}/test.xyz`)
  await Editor.setCursor(0, 0)

  // act
  await Editor.goToTypeDefinition()

  // assert
  const overlayMessage = Locator('.EditorOverlayMessage')
  await expect(overlayMessage).toBeVisible()
  // TODO should say "no type definition provider found"
  await expect(overlayMessage).toHaveText(
    `No type definition found for 'export'`
  )
})

export {}
