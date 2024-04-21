export const skip = true

export const name = 'sample.diagnostic-provider-empty'

export const test = async ({ Main, Panel, FileSystem, Workspace, Extension, SideBar, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/test.js`, `abcdefgh`)
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())
  await Main.openUri(`${tmpDir}/test.js`)

  // act
  await Panel.open()

  // assert
  const problems = Locator(`.Viewlet.Problems`)
  await expect(problems).toBeVisible()
  await expect(problems).toHaveText('No problems have been detected in the workspace.')
}
