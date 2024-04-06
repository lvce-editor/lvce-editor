export const name = 'viewlet.problems'

export const test = async ({ Main, FileSystem, Workspace, Extension, Locator, Panel, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.xyz`, 'content 1')

  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())

  await Main.openUri(`${tmpDir}/file1.xyz`)
  await Panel.open()

  // assert
  const problemsView = Locator('.Problems')
  await expect(problemsView).toBeVisible()

  // TODO verify that diagnostics are visible
}
