export const name = 'sample.type-definition-provider-not-registered'

export const test = async ({ FileSystem, Workspace, Main, Editor, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.xyz`,
    `export const add = () => {
  return a + b
}

add(1, 2)
    `,
  )
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/test.xyz`)
  await Editor.setCursor(0, 0)

  // act
  await Editor.goToTypeDefinition()

  // assert
  const overlayMessage = Locator('.EditorOverlayMessage')
  await expect(overlayMessage).toBeVisible()
  // TODO should include language id in error message only when available
  await expect(overlayMessage).toHaveText(`VError: Failed to execute type definition provider: No type definition provider found for unknown`)
}
