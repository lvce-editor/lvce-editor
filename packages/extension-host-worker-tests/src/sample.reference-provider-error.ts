export const name = 'sample.reference-provider-error'

export const test = async ({ FileSystem, Workspace, Extension, Main, Editor, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(
    `${tmpDir}/test.xyz`,
    `export const add = () => {}
`,
  )

  // act
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())
  await Main.openUri(`${tmpDir}/test.xyz`)
  await Editor.setCursor(0, 0)
  await Editor.findAllReferences()

  // assert
  const sideBarContent = Locator('#SideBar .Error')
  await expect(sideBarContent).toBeVisible()

  // TODO should show part of stack trace maybe?
  await expect(sideBarContent).toHaveText(`VError: Failed to execute reference provider: oops`)
}
