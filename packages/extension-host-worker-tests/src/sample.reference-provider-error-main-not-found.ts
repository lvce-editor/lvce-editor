export const name = 'sample.reference-provider-error-main-not-found'

export const skip = 1

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
  await Editor.findAllReferences()

  // assert
  const sideBarContent = Locator('#SideBar .Error')
  await expect(sideBarContent).toBeVisible()

  // TODO should show part of stack trace maybe?
  // const origin = location.origin
  const mainUrl = new URL('../fixtures/sample.reference-provider-error-main-not-found/not-found.js', import.meta.url).toString()
  await expect(sideBarContent).toHaveText(
    `VError: Failed to activate extension sample.reference-provider-error-main-not-found: Failed to import ${mainUrl}: Not found (404)`,
  )
}
