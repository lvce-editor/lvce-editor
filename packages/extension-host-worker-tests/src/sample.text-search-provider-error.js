/// <reference path="../typings/types.d.ts" />

const name = 'sample.text-search-provider-error'

test('sample.text-search-provider-error', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()

  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(
    new URL(`../fixtures/${name}`, import.meta.url).toString()
  )
  await SideBar.open('Search')

  // act
  await Search.setValue('abc')

  const viewletSearch = Locator('.Viewlet[data-viewlet-id="Search"]')

  const message = viewletSearch.locator('[role="status"]')
  await expect(message).toHaveText(
    'Error: Failed to execute text search provider: oops'
  )
})
