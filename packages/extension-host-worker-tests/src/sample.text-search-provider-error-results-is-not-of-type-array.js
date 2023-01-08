const name = 'sample.text-search-provider-error-results-is-not-of-type-array'

test('sample.text-search-provider-error-results-is-not-of-type-array', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()

  await Workspace.setPath(tmpDir)
  await Extension.addWebExtension(
    new URL(`../fixtures/${name}`, import.meta.url).toString()
  )
  await SideBar.open('Search')

  // act
  await Search.setValue('abc')

  // assert
  const viewletSearch = Locator('.Search')
  const message = viewletSearch.locator('[role="status"]')
  await expect(message).toHaveText('Error: results must be of type array')

  // TODO trace back error to return value of extension and
  // show stack trace for extension return value
})

export {}
