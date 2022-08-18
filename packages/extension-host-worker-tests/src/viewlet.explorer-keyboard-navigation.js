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

  // act
  const explorer = Locator('.Viewlet[data-viewlet-id="Explorer"]')
  await explorer.click()

  // assert
  await expect(explorer).toHaveClass('FocusOutline')

  // act
  await Explorer.focusNext()

  // assert
  const titleA = '/a'
  const treeItemA = Locator(`.TreeItem[title$="${titleA}"]`)
  await expect(treeItemA).toHaveClass('FocusOutline')

  // act
  await Explorer.clickCurrent()

  // assert
  const titleB = '/a/b'
  const treeItemB = Locator(`.TreeItem[title$="${titleB}"]`)
  await expect(treeItemB).toBeVisible()
  await expect(treeItemA).toHaveClass('FocusOutline')

  // act
  await Explorer.focusNext()

  // assert
  await expect(treeItemB).toHaveClass('FocusOutline')

  // act
  await Explorer.clickCurrent()

  // assert
  const titleC = '/a/b/c.txt'
  const treeItemC = Locator(`.TreeItem[title$="${titleC}"]`)
  await expect(treeItemC).toBeVisible()
  await expect(treeItemB).toHaveClass('FocusOutline')

  // act
  await Explorer.focusNext()

  // assert
  await expect(treeItemC).toHaveClass('FocusOutline')

  // act
  await Explorer.clickCurrent()

  // assert
  const editor = Locator('.Editor')
  await expect(editor).toHaveText('ccccc')

  // act
  await Explorer.handleArrowLeft()

  // assert
  await expect(treeItemB).toHaveClass('FocusOutline')
  await expect(treeItemC).toBeVisible()

  // act
  await Explorer.handleArrowLeft()

  // assert
  await expect(treeItemB).toHaveClass('FocusOutline')
  await expect(treeItemC).toBeHidden()

  // act
  await Explorer.handleArrowLeft()

  // assert
  await expect(treeItemA).toHaveClass('FocusOutline')
  await expect(treeItemB).toBeVisible()

  // act
  await Explorer.handleArrowLeft()

  // assert
  await expect(treeItemA).toHaveClass('FocusOutline')
  await expect(treeItemB).toBeHidden()

  // act
  await Explorer.focusLast()

  // assert
  const titleTest = '/test.txt'
  const treeItemTestTxt = Locator(`.TreeItem[title$="${titleTest}"]`)
  await expect(treeItemTestTxt).toHaveClass('FocusOutline')

  // act
  await Explorer.focusFirst()

  // assert
  await expect(treeItemA).toHaveClass('FocusOutline')

  // act
  await Explorer.removeDirent()

  // assert
  await expect(treeItemA).toBeHidden()
  const titleFolder1 = `/folder-1`
  const treeItemFolder1 = Locator(`.TreeItem[title$="${titleFolder1}"]`)
  await expect(treeItemFolder1).toHaveClass('FocusOutline')
})
