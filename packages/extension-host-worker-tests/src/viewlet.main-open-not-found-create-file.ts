export const name = 'viewlet.main-open-not-found-create-file'

export const test = async ({ FileSystem, Workspace, Main, Locator, expect, SideBar }) => {
  // arrange
  await SideBar.hide()
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Main.openUri(`${tmpDir}/not-found.txt`)
  const errorMessage = Locator('.TextEditorErrorMessage')
  await expect(errorMessage).toBeVisible()
  await expect(errorMessage).toHaveText('The editor could not be opened because the file was not found')

  // act
  const createFileButton = Locator('.Button', {
    hasText: 'Create File',
  })
  await expect(createFileButton).toBeVisible()
  await createFileButton.click()

  // assert
  // TODO verify that error editor is removed
  // TODO verify that new editor has been created
}
