export const name = 'sample.completion-provider-error-invalid-return-value-number'

export const test = async ({ FileSystem, Workspace, Extension, Main, Editor, Locator, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.xyz`,
    `export const add = () => {}
`
  )

  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL('../fixtures/sample.completion-provider-error-invalid-return-value-number', import.meta.url).toString())
  await Main.openUri(`${tmpDir}/test.xyz`)
  await Editor.setCursor(0, 0)
  await Editor.openCompletion()

  const overlayMessage = Locator('.EditorOverlayMessage')
  await expect(overlayMessage).toBeVisible()
  // TODO maybe have a setting to handle this kind of error without showing a popup,
  // just handle undefined value gracefully
  await expect(overlayMessage).toHaveText(
    `Failed to execute completion provider: VError: invalid completion result: completion must be of type array but is 42`
  )
}
