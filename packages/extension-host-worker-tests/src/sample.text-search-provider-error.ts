export const name = 'sample.text-search-provider-error'

export const skip = true

export const test = async ({ FileSystem, Workspace, Extension, SideBar, Search, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()

  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())
  await SideBar.open('Search')

  // act
  await Search.setValue('abc')

  // assert
  const viewletSearch = Locator('.Search')
  const message = viewletSearch.locator('[role="status"]')
  await expect(message).toHaveText('VError: Failed to execute text search provider: oops')
}
