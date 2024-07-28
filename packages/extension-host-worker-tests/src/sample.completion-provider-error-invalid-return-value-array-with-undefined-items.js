export const skip = true

export const test = async ({ FileSystem, Workspace, Extension, Main, Editor, expect, Locator }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.xyz`,
    `export const add = () => {}
`,
  )

  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(
    new URL('../fixtures/sample.completion-provider-error-invalid-return-value-array-with-undefined-items', import.meta.url).toString(),
  )
  await Main.openUri(`${tmpDir}/test.xyz`)
  await Editor.setCursor(0, 0)
  await Editor.openCompletion()

  const overlayMessage = Locator('.EditorOverlayMessage')
  await expect(overlayMessage).toBeVisible()
  // TODO maybe just handle undefined value gracefully
  await expect(overlayMessage).toHaveText(
    `Failed to execute completion provider: VError: invalid completion result: expected completion item to be of type object but was of type undefined`,
  )
  await expect(overlayMessage).toHaveCSS('left', '0px')
  await expect(overlayMessage).toHaveCSS('top', '75px')
}
