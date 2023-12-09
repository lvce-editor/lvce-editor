export const skip = true

export const name = 'sample.source-control-provider-status-bar-item'

export const test = async ({ FileSystem, Workspace, Extension, StatusBar }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())

  // act

  // assert
  const statusBarItems = await StatusBar.getStatusBarItems()
  console.log({ statusBarItems })
  // TODO statusBarItem should be visible here
}
