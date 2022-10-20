const name = 'sample.text-search-provider'

test('sample.text-search-provider', async () => {
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
  const results = Locator(`.Search .TreeItem`)
  await expect(results).toHaveCount(2)
  await expect(results.nth(0)).toHaveText('index.txt')
  await expect(results.nth(1)).toHaveText('    <title>Document</title>')
})
