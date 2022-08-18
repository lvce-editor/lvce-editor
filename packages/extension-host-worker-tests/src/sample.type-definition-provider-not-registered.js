const name = 'sample.type-definition-provider-not-registered'

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
  // act
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(`${tmpDir}/test.xyz`)
  await Editor.setCursor(0, 0)
  await Editor.openEditorContextMenu()
  await ContextMenu.selectItem('Go To Type Definition')

  // assert
  const overlayMessage = Locator('.EditorOverlayMessage')
  await expect(overlayMessage).toBeVisible()
  // TODO should say "no type definition provider found"
  await expect(overlayMessage).toHaveText('No type definition found')
})
