export const name = 'sample.tab-completion-provider-error-invalid-return-value-number'

export const test = async ({ FileSystem, Workspace, Extension, Main, Editor, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.xyz`,
    `export const add = () => {}
`,
  )

  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())

  // act
  await Main.openUri(`${tmpDir}/test.xyz`)
  await Editor.setCursor(0, 0)
  await Editor.executeTabCompletion()

  // assert
  const overlayMessage = Locator('.EditorOverlayMessage')
  await expect(overlayMessage).toBeVisible()
  await expect(overlayMessage).toHaveText(
    'Error: Failed to execute tab completion provider: VError: invalid tab completion result: tabCompletion must be of type object but is 42',
  )
}
