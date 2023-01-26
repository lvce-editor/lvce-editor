export const name = 'sample.reference-provider-error'

export const test = async ({ FileSystem, Workspace, Extension, Main, Editor, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.xyz`,
    `export const add = () => {}
`
  )

  // act
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())
  await Main.openUri(`${tmpDir}/test.xyz`)
  await Editor.setCursor(0, 0)
  await Editor.findAllReferences()

  // assert
  const viewletLocations = Locator('.Locations')
  await expect(viewletLocations).toBeVisible()

  // TODO should show part of stack trace maybe?
  await expect(viewletLocations).toHaveText(`Error: Failed to execute reference provider: oops`)
}
