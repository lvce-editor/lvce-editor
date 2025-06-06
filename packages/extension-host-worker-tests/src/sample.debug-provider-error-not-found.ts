export const skip = true

export const name = 'sample.debug-provider-error-not-found'

export const test = async ({ FileSystem, Workspace, Extension, SideBar, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())

  // act
  await SideBar.open('Run And Debug')

  // assert
  const sideBarContent = Locator('#SideBar .Error')
  await expect(sideBarContent).toHaveText('VError: Failed to execute debug provider: no debug provider "test-debug" found')
}
