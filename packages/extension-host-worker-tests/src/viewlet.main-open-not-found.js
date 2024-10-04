export const name = 'viewlet.main-open-not-found'

export const test = async ({ FileSystem, Workspace, Main, Locator, expect, SideBar }) => {
  // arrange
  await SideBar.hide()
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(`${tmpDir}/not-found.txt`)

  // assert
  // TODO check that not-found message is displayed
}
