import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.search-view-mode'

export const test: Test = async ({ expect, FileSystem, Locator, Search, SideBar, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/src`)
  await FileSystem.mkdir(`${tmpDir}/src/nested`)
  await FileSystem.writeFile(`${tmpDir}/src/nested/file.ts`, 'needle')
  await Workspace.setPath(tmpDir)
  await SideBar.open('Search')
  await Search.setValue('needle')
  const message = Locator('.Search').locator('[role="status"]')
  await expect(message).toHaveText('1 result in 1 file')

  const actions = Locator('.SideBarTitleArea')
  const viewAsTree = actions.locator('[name="ViewAsTree"]')
  await expect(viewAsTree).toHaveAttribute('title', 'View as Tree')

  // act
  await viewAsTree.click()

  // assert
  const sourceFolder = Locator('.TreeItem[aria-label="/src"]')
  const nestedFolder = Locator('.TreeItem[aria-label="/src/nested"]')
  const file = Locator('.TreeItem[aria-label="/src/nested/file.ts"]')
  const match = Locator('.TreeItem[aria-label="needle"]')
  await expect(sourceFolder).toHaveAttribute('aria-level', '0')
  await expect(nestedFolder).toHaveAttribute('aria-level', '1')
  await expect(file).toHaveAttribute('aria-level', '2')
  await expect(match).toHaveAttribute('aria-level', '3')

  const viewAsList = actions.locator('[name="ViewAsList"]')
  await expect(viewAsList).toHaveAttribute('title', 'View as List')

  // act
  await viewAsList.click()

  // assert
  await expect(Locator('.Search [role="treeitem"]')).toHaveCount(2)
  await expect(file).toHaveAttribute('aria-level', '0')
  await expect(match).toHaveAttribute('aria-level', '1')
  await expect(viewAsTree).toHaveAttribute('title', 'View as Tree')
}
