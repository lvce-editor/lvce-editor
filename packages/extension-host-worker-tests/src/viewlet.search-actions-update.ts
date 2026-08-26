export const name = 'viewlet.search-actions-update'

export const test = async ({ FileSystem, Locator, Search, SideBar, Workspace, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'search action result')
  await Workspace.setPath(tmpDir)
  await SideBar.open('Search')
  const actions = Locator('.SideBarTitleArea')
  const refresh = actions.locator('[name="Refresh"]')
  const clear = actions.locator('[name="ClearAll"]')
  await expect(refresh).toHaveAttribute('disabled', '')
  await expect(clear).toHaveAttribute('disabled', '')

  // act
  await Search.setValue('search action result')

  // assert
  await expect(Locator('.Search .TreeItem')).toHaveCount(2)
  await expect(refresh).toHaveAttribute('disabled', null)
  await expect(clear).toHaveAttribute('disabled', null)
}
