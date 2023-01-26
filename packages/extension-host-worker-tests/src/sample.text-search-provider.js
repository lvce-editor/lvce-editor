export const name = 'sample.text-search-provider'

export const test = async ({ FileSystem, Workspace, Extension, SideBar, Search, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()

  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(new URL(`../fixtures/${name}`, import.meta.url).toString())
  await SideBar.open('Search')

  // act
  await Search.setValue('Doc')

  // assert
  const results = Locator(`.Search .TreeItem`)
  await expect(results).toHaveCount(2)
  await expect(results.nth(0)).toHaveText('index.txt')
  await expect(results.nth(1)).toHaveText('    <title>Document</title>')
  const highlight = Locator('.Search .Highlight')
  await expect(highlight).toHaveText('Doc')
}
