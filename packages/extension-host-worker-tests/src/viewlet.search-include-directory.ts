import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.search-include-directory'

export const test: Test = async ({ expect, FileSystem, Locator, Search, SideBar, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/packages`)
  await FileSystem.mkdir(`${tmpDir}/packages/build`)
  await FileSystem.mkdir(`${tmpDir}/packages/other`)
  await FileSystem.writeFile(`${tmpDir}/packages/build/package.json`, 'build')
  await FileSystem.writeFile(`${tmpDir}/packages/build/nested.txt`, 'build')
  await FileSystem.writeFile(`${tmpDir}/packages/other/package.json`, 'build')
  await Workspace.setPath(tmpDir)
  await SideBar.open('Search')
  await Search.setValue('build')
  const viewletSearch = Locator('.Search')
  const message = viewletSearch.locator('[role="status"]')
  await expect(message).toHaveText('3 results in 3 files')

  // act
  await Search.setIncludeValue('packages/build')

  // assert
  await expect(message).toHaveText('2 results in 2 files')
  await expect(viewletSearch.locator('.TreeItem[aria-label$="packages/build/package.json"]')).toBeVisible()
  await expect(viewletSearch.locator('.TreeItem[aria-label$="packages/build/nested.txt"]')).toBeVisible()
  await expect(viewletSearch.locator('.TreeItem[aria-label$="packages/other/package.json"]')).toBeHidden()
}
