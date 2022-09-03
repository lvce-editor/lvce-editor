// TODO maybe merge this test with the other explorer test, less end to end tests will run faster
test('viewlet.explorer-keyboard-navigation', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a/b`)
  await FileSystem.writeFile(`${tmpDir}/a/b/c.txt`, 'ccccc')
  await FileSystem.mkdir(`${tmpDir}/folder-1`)
  await FileSystem.mkdir(`${tmpDir}/folder-2`)
  await FileSystem.mkdir(`${tmpDir}/folder-3`)
  await FileSystem.writeFile(`${tmpDir}/test.txt`, 'div')
  await Workspace.setPath(tmpDir)
  await Explorer.focusFirst()

  // act
  await Explorer.expandRecursively()

  // assert
  const treeItems = Locator('.TreeItem')
  await expect(treeItems.nth(0)).toHaveText('a')
  await expect(treeItems.nth(1)).toHaveText('b')
  await expect(treeItems.nth(2)).toHaveText('c.txt')
})
