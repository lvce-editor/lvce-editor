import {
  getTmpDir,
  runWithExtension,
  test,
  expect,
  writeFile,
  mkdir,
} from './_testFrameWork.js'

// manual accessibility tests

// explorer
// nvda says: "Files explorer tree"
// windows narrator says: "Files explorer, tree"
// orca says: "Files explorer tree"

// explorer item
// nvda says: "sample folder, collapsed, two of five, level 1"
// windows narrator says: "sample folder, two of five, collapsed, selected, heading level 1" ❌
// orca says: "sample-folder, collapsed"

test('viewlet.explorer-accessibility', async () => {
  const tmpDir = await getTmpDir()
  await mkdir(`${tmpDir}/languages`)
  await mkdir(`${tmpDir}/sample-folder`)
  await writeFile(`${tmpDir}/test.txt`, 'div')
  await writeFile(`${tmpDir}/languages/index.html`, 'div')
  await writeFile(`${tmpDir}/sample-folder/a.txt`, '')
  await writeFile(`${tmpDir}/sample-folder/b.txt`, '')
  await writeFile(`${tmpDir}/sample-folder/c.txt`, '')
  const page = await runWithExtension({
    folder: tmpDir,
    name: '',
  })
  const testTxt = page.locator('text=test.txt')
  await testTxt.click()

  const titleLanguages = '/languages'
  const treeItemLanguages = page.locator(
    `.TreeItem[title$="${titleLanguages}"]`
  )
  await expect(treeItemLanguages).toHaveAttribute('tabindex', '-1')
  await expect(treeItemLanguages).toHaveAttribute('role', 'treeitem')
  await expect(treeItemLanguages).toHaveAttribute('aria-level', '1')
  await expect(treeItemLanguages).toHaveAttribute('aria-posinset', '1')
  await expect(treeItemLanguages).toHaveAttribute('aria-setsize', '3')
  await expect(treeItemLanguages).toHaveAttribute('aria-expanded', 'false')

  const titleSampleFolder = '/sample-folder'
  const treeItemSampleFolder = page.locator(
    `.TreeItem[title$="${titleSampleFolder}"]`
  )
  await expect(treeItemSampleFolder).toHaveAttribute('tabindex', '-1')
  await expect(treeItemSampleFolder).toHaveAttribute('role', 'treeitem')
  await expect(treeItemSampleFolder).toHaveAttribute('aria-level', '1')
  await expect(treeItemSampleFolder).toHaveAttribute('aria-posinset', '2')
  await expect(treeItemSampleFolder).toHaveAttribute('aria-setsize', '3')
  await expect(treeItemSampleFolder).toHaveAttribute('aria-expanded', 'false')

  const titleTest = '/test.txt'
  const treeItemTestTxt = page.locator(`.TreeItem[title$="${titleTest}"]`)
  await expect(treeItemTestTxt).toHaveAttribute('tabindex', '-1')
  await expect(treeItemTestTxt).toHaveAttribute('aria-level', '1')
  await expect(treeItemTestTxt).toHaveAttribute('aria-posinset', '3')
  await expect(treeItemTestTxt).toHaveAttribute('aria-setsize', '3')
  await expect(treeItemTestTxt).not.toHaveAttribute('aria-expanded', 'false')

  await treeItemLanguages.click()
  await expect(treeItemLanguages).toHaveAttribute('aria-level', '1')
  await expect(treeItemLanguages).toHaveAttribute('aria-posinset', '1')
  await expect(treeItemLanguages).toHaveAttribute('aria-setsize', '3')
  await expect(treeItemLanguages).toHaveAttribute('aria-expanded', 'true')

  const titleIndexHtml = '/languages/index.html'
  const treeItemIndexHtml = page.locator(
    `.TreeItem[title$="${titleIndexHtml}"]`
  )
  await expect(treeItemIndexHtml).toHaveAttribute('tabindex', '-1')
  await expect(treeItemIndexHtml).toHaveAttribute('aria-level', '2')
  await expect(treeItemIndexHtml).toHaveAttribute('aria-posinset', '1')
  await expect(treeItemIndexHtml).toHaveAttribute('aria-setsize', '1')
  await expect(treeItemIndexHtml).not.toHaveAttribute('aria-expanded', 'false')
})
