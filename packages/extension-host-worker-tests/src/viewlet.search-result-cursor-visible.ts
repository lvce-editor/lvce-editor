export const name = 'viewlet.search-result-cursor-visible'

export const test = async ({ FileSystem, Locator, Search, SideBar, Workspace, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'first line\na')
  await Workspace.setPath(tmpDir)
  await SideBar.open('Search')
  await Search.setValue('a')
  const results = Locator('.Search .TreeItem')
  await expect(results).toHaveCount(2)

  // act
  await results.nth(1).click()

  // assert
  const cursor = Locator('.EditorCursor')
  await expect(cursor).toBeVisible()
  await expect(cursor).toHaveCSS('translate', /^(6|7|8|9|10).*?px 20px$/)
}
