import {
  expect,
  getTmpDir,
  runWithExtension,
  test,
  writeFile,
  mkdir,
} from './_testFrameWork.js'

test('viewlet.explorer-keyboard-navigation', async () => {
  const tmpDir = await getTmpDir()
  await mkdir(`${tmpDir}/a/b`)
  await writeFile(`${tmpDir}/a/b/c.txt`, 'ccccc')
  await mkdir(`${tmpDir}/folder-1`)
  await mkdir(`${tmpDir}/folder-2`)
  await mkdir(`${tmpDir}/folder-3`)
  await writeFile(`${tmpDir}/test.txt`, 'div')
  const page = await runWithExtension({
    folder: tmpDir,
    name: '',
  })
  const testTxt = page.locator('text=test.txt')
  await testTxt.click()
  const tokenText = page.locator('.Token.Text')
  await tokenText.click()
  const explorer = page.locator('.Viewlet[data-viewlet-id="Explorer"]')
  await explorer.click()
  await expect(explorer).toHaveClass('FocusOutline')

  await page.keyboard.press('ArrowDown')
  const titleA = '/a'
  const treeItemA = page.locator(`.TreeItem[title$="${titleA}"]`)
  await expect(treeItemA).toHaveClass('FocusOutline')

  await page.keyboard.press('Space')
  const titleB = '/a/b'
  const treeItemB = page.locator(`.TreeItem[title$="${titleB}"]`)
  await expect(treeItemB).toBeVisible()
  await expect(treeItemA).toHaveClass('FocusOutline')

  await page.keyboard.press('ArrowDown')
  await expect(treeItemB).toHaveClass('FocusOutline')

  await page.keyboard.press('Enter')
  const titleC = '/a/b/c.txt'
  const treeItemC = page.locator(`.TreeItem[title$="${titleC}"]`)
  await expect(treeItemC).toBeVisible()
  await expect(treeItemB).toHaveClass('FocusOutline')

  await page.keyboard.press('ArrowDown')
  await expect(treeItemC).toHaveClass('FocusOutline')

  await page.keyboard.press('Enter')
  const editor = page.locator('.Editor')
  await expect(editor).toHaveText('ccccc')

  await page.keyboard.press('ArrowLeft')
  await expect(treeItemB).toHaveClass('FocusOutline')
  await expect(treeItemC).toBeVisible()

  await page.keyboard.press('ArrowLeft')
  await expect(treeItemB).toHaveClass('FocusOutline')
  await expect(treeItemC).not.toBeVisible()

  await page.keyboard.press('ArrowLeft')
  await expect(treeItemA).toHaveClass('FocusOutline')
  await expect(treeItemB).toBeVisible()

  await page.keyboard.press('ArrowLeft')
  await expect(treeItemA).toHaveClass('FocusOutline')
  await expect(treeItemB).not.toBeVisible()

  await page.keyboard.press('End')
  const titleTest = '/test.txt'
  const treeItemTestTxt = page.locator(`.TreeItem[title$="${titleTest}"]`)
  await expect(treeItemTestTxt).toHaveClass('FocusOutline')

  await page.keyboard.press('Home')
  await expect(treeItemA).toHaveClass('FocusOutline')

  await page.keyboard.press('Delete')
  await expect(treeItemA).not.toBeVisible()
  const titleFolder1 = `/folder-1`
  const treeItemFolder1 = page.locator(`.TreeItem[title$="${titleFolder1}"]`)
  await expect(treeItemFolder1).toHaveClass('FocusOutline')

  // TODO test rename behavior
})
