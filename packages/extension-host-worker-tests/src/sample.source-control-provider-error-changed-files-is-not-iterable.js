export const name = 'sample.source-control-provider-error-changed-files-is-not-iterable'

export const test = async ({ FileSystem, Workspace, Extension, SideBar, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())

  // act
  await SideBar.open('Source Control')

  // assert
  const sideBarContent = Locator('#SideBar .Error')
  // TODO error message could be improved: Failed to query changed files from test-source-control-provider: changedFiles must be of type array but was undefined
  await expect(sideBarContent).toHaveText('TypeError: changedFiles is not iterable (cannot read property undefined)')
}
