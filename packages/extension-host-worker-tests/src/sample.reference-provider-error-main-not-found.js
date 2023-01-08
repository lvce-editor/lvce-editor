const name = 'sample.reference-provider-error-main-not-found'

test('sample.reference-provider-error-main-not-found', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.xyz`,
    `export const add = () => {}
`
  )

  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(
    new URL(`../fixtures/${name}`, import.meta.url).toString()
  )

  // act
  await Main.openUri(`${tmpDir}/test.xyz`)
  await Editor.setCursor(0, 0)
  await Editor.findAllReferences()

  // assert
  const viewletLocations = Locator('.Locations')
  await expect(viewletLocations).toBeVisible()

  // TODO should show part of stack trace maybe?
  // const origin = location.origin
  const mainUrl = new URL(
    '../fixtures/sample.reference-provider-error-main-not-found/not-found.js',
    import.meta.url
  ).toString()
  await expect(viewletLocations).toHaveText(
    `Error: Failed to activate extension sample.reference-provider-error-main-not-found: Failed to import ${mainUrl}: Not found (404)`
  )
})

export {}
