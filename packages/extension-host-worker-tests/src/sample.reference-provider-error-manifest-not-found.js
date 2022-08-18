const name = 'sample.reference-provider-error-main-not-found'

test('sample.reference-provider-error-manifest-not-found', async () => {
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
  await Editor.openEditorContextMenu()
  await ContextMenu.selectItem('Find all references')

  // TODO viewlet locations should still be visible
  // const viewletLocations = page.locator('.Viewlet[data-viewlet-id="Locations"]')
  // await expect(viewletLocations).toBeVisible()

  // await expect(viewletLocations).toHaveText(
  //   `Failed to execute reference provider: Failed to activate extension`
  // )

  // TODO should show dialog with json stack trace
})

export {}
