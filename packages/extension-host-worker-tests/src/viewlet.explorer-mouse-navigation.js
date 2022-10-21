test('viewlet.explorer-mouse-navigation', async () => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a/b`)
  await FileSystem.writeFile(`${tmpDir}/a/b/c.txt`, 'ccccc')
  await FileSystem.mkdir(`${tmpDir}/folder-1`)
  await FileSystem.mkdir(`${tmpDir}/folder-2`)
  await FileSystem.mkdir(`${tmpDir}/folder-3`)
  await FileSystem.writeFile(`${tmpDir}/test.txt`, 'div')
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.handleClick(-1)

  // assert
  const explorer = Locator('.Explorer')
  await expect(explorer).toHaveClass('FocusOutline')

  // act
  await Explorer.handleClick(0)

  // assert
  const titleA = '/a'
  const treeItemA = Locator(`.TreeItem[title$="${titleA}"]`)
  await expect(treeItemA).toHaveId('TreeItemActive')

  // assert
  const titleB = '/a/b'
  const treeItemB = Locator(`.TreeItem[title$="${titleB}"]`)
  await expect(treeItemB).toBeVisible()
  await expect(treeItemA).toHaveId('TreeItemActive')

  // act
  await Explorer.handleClick(1)

  // assert
  await expect(treeItemB).toHaveId('TreeItemActive')
})
