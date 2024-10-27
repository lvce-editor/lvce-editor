export const name = 'viewlet.main-open-not-found'

export const test = async ({ FileSystem, Workspace, Main, Locator, expect, SideBar }) => {
  // arrange
  await SideBar.hide()
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)

  // act
  await Main.openUri(`${tmpDir}/not-found.txt`)

  // assert
  const errorMessage = Locator('.TextEditorErrorMessage')
  await expect(errorMessage).toBeVisible()
  await expect(errorMessage).toHaveText('The editor could not be opened because the file was not found')
}
