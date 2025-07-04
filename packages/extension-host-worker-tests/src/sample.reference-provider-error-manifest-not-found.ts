export const name = 'sample.reference-provider-error-main-not-found'

export const skip = 1

export const test = async ({ FileSystem, Workspace, Extension, Main, Editor }) => {
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
  await Editor.findAllReferences()

  // TODO viewlet locations should still be visible
  // const viewletLocations = page.locator('.Locations')
  // await expect(viewletLocations).toBeVisible()

  // await expect(viewletLocations).toHaveText(
  //   `Failed to execute reference provider: Failed to activate extension`
  // )

  // TODO should show dialog with json stack trace
}
