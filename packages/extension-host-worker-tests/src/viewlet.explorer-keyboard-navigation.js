import {
  expect,
  getTmpDir,
  runWithExtension,
  test,
  writeFile,
  mkdir,
} from './_testFrameWork.js'

test('viewlet.explorer-keyboard-navigation', async () => {
  // arrange
  const tmpDir = await getTmpDir()
  await mkdir(`${tmpDir}/a/b`)
  await writeFile(`${tmpDir}/a/b/c.txt`, 'ccccc')
  await mkdir(`${tmpDir}/folder-1`)
  await mkdir(`${tmpDir}/folder-2`)
  await mkdir(`${tmpDir}/folder-3`)
  await writeFile(`${tmpDir}/test.txt`, 'div')
  const { Main, locator, ContextMenu, keyboard } = await runWithExtension({
    folder: tmpDir,
    name: '',
  })

  // act
  const testTxt = locator('text=test.txt')
  await testTxt.click()
  const tokenText = locator('.Token.Text')
  await tokenText.click()
  const explorer = locator('.Viewlet[data-viewlet-id="Explorer"]')
  await explorer.click()

  // assert
  await expect(explorer).toHaveClass('FocusOutline')

  // act
  await keyboard.press('ArrowDown')

  // assert
  const titleA = '/a'
  const treeItemA = locator(`.TreeItem[title$="${titleA}"]`)
  await expect(treeItemA).toHaveClass('FocusOutline')

  // act
  await keyboard.press('Space')

  // assert
  const titleB = '/a/b'
  const treeItemB = locator(`.TreeItem[title$="${titleB}"]`)
  await expect(treeItemB).toBeVisible()
  await expect(treeItemA).toHaveClass('FocusOutline')

  // act
  await keyboard.press('ArrowDown')

  // assert
  await expect(treeItemB).toHaveClass('FocusOutline')

  // act
  await keyboard.press('Enter')

  // assert
  const titleC = '/a/b/c.txt'
  const treeItemC = locator(`.TreeItem[title$="${titleC}"]`)
  await expect(treeItemC).toBeVisible()
  await expect(treeItemB).toHaveClass('FocusOutline')

  // act
  await keyboard.press('ArrowDown')

  // assert
  await expect(treeItemC).toHaveClass('FocusOutline')

  // act
  await keyboard.press('Enter')

  // assert
  const editor = locator('.Editor')
  await expect(editor).toHaveText('ccccc')

  // act
  await keyboard.press('ArrowLeft')

  // assert
  await expect(treeItemB).toHaveClass('FocusOutline')
  await expect(treeItemC).toBeVisible()

  // act
  await keyboard.press('ArrowLeft')

  // assert
  await expect(treeItemB).toHaveClass('FocusOutline')
  await expect(treeItemC).not.toBeVisible()

  // act
  await keyboard.press('ArrowLeft')

  // assert
  await expect(treeItemA).toHaveClass('FocusOutline')
  await expect(treeItemB).toBeVisible()

  // act
  await keyboard.press('ArrowLeft')

  // assert
  await expect(treeItemA).toHaveClass('FocusOutline')
  await expect(treeItemB).not.toBeVisible()

  // act
  await keyboard.press('End')

  // assert
  const titleTest = '/test.txt'
  const treeItemTestTxt = locator(`.TreeItem[title$="${titleTest}"]`)
  await expect(treeItemTestTxt).toHaveClass('FocusOutline')

  // act
  await keyboard.press('Home')

  // assert
  await expect(treeItemA).toHaveClass('FocusOutline')

  // act
  await keyboard.press('Delete')

  // assert
  await expect(treeItemA).not.toBeVisible()
  const titleFolder1 = `/folder-1`
  const treeItemFolder1 = locator(`.TreeItem[title$="${titleFolder1}"]`)
  await expect(treeItemFolder1).toHaveClass('FocusOutline')

  // TODO test rename behavior
})
