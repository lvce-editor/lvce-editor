export const name = 'sample.source-control-provider-status-bar-item'

export const test = async ({ FileSystem, Workspace, Extension, Locator, expect, StatusBar }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())

  // act
  await StatusBar.update()

  // assert
  const statusBarItems = Locator('.StatusBarItemsLeft')
  await expect(statusBarItems).toBeVisible()

  // TODO statusBarItem should be visible here
}
