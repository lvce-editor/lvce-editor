import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.search-open-in-editor'

export const test: Test = async ({ expect, FileSystem, Locator, Search, SideBar, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'needle')
  await Workspace.setPath(tmpDir)
  await SideBar.open('Search')

  const sideBarSearch = Locator('.Search')
  await Search.setValue('needle')

  await expect(sideBarSearch.locator('[role="treeitem"]')).toHaveCount(2)
  const sideBarMessage = sideBarSearch.locator('[role="status"]')
  await expect(sideBarMessage).toHaveText('1 result in 1 file')
  const openInEditor = sideBarSearch.locator('button[name="OpenSearchEditor"]')
  await expect(openInEditor).toHaveAttribute('title', 'Copy current search results to an editor (Alt+Enter)')
  await openInEditor.click()

  const searches = Locator('.Search')
  await expect(searches).toHaveCount(2)
  const editorSearch = searches.nth(1)
  const editorMessage = editorSearch.locator('[role="status"]')
  await expect(editorSearch).toBeVisible()
  await expect(editorSearch.locator('textarea[name="SearchValue"]')).toHaveValue('needle')
  await expect(editorMessage).toHaveText('1 result in 1 file')
  await expect(editorSearch.locator('[role="treeitem"]')).toHaveCount(2)
}
