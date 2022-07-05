import { mkdir, writeFile } from 'fs/promises'
import { sep } from 'path'
import { expect, getTmpDir, runWithExtension, test } from './_testFrameWork.js'

/**
 * @param {string} path
 * @returns string
 */
const escapePath = (path) => {
  return path.replaceAll('/', sep).replaceAll('\\', '\\\\')
}

test.skip('viewlet.explorer-keyboard-navigation', async () => {
  const tmpDir = await getTmpDir()
  await mkdir(`${tmpDir}/a/b`, { recursive: true })
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
  await expect(explorer).toBeFocused()

  await page.keyboard.press('ArrowDown')
  const titleA = escapePath('/a')
  const treeItemA = page.locator(`.TreeItem[title$="${titleA}"]`)
  await expect(treeItemA).toBeFocused()

  await page.keyboard.press('Space')
  const titleB = escapePath('/a/b')
  const treeItemB = page.locator(`.TreeItem[title$="${titleB}"]`)
  await expect(treeItemB).toBeVisible()
  await expect(treeItemA).toBeFocused()

  await page.keyboard.press('ArrowDown')
  await expect(treeItemB).toBeFocused()

  await page.keyboard.press('Enter')
  const titleC = escapePath('/a/b/c.txt')
  const treeItemC = page.locator(`.TreeItem[title$="${titleC}"]`)
  await expect(treeItemC).toBeVisible()
  await expect(treeItemB).toBeFocused()

  await page.keyboard.press('ArrowDown')
  await expect(treeItemC).toBeFocused()

  await page.keyboard.press('Enter')
  const editor = page.locator('.Editor')
  await expect(editor).toHaveText('ccccc')

  await page.keyboard.press('ArrowLeft')
  await expect(treeItemB).toBeFocused()
  await expect(treeItemC).toBeVisible()

  await page.keyboard.press('ArrowLeft')
  await expect(treeItemB).toBeFocused()
  await expect(treeItemC).not.toBeVisible()

  await page.keyboard.press('ArrowLeft')
  await expect(treeItemA).toBeFocused()
  await expect(treeItemB).toBeVisible()

  await page.keyboard.press('ArrowLeft')
  await expect(treeItemA).toBeFocused()
  await expect(treeItemB).not.toBeVisible()

  await page.keyboard.press('End')
  const titleTest = escapePath('/test.txt')
  const treeItemTestTxt = page.locator(`.TreeItem[title$="${titleTest}"]`)
  await expect(treeItemTestTxt).toBeFocused()

  await page.keyboard.press('Home')
  await expect(treeItemA).toBeFocused()

  await page.keyboard.press('Delete')
  await expect(treeItemA).not.toBeVisible()
  const titleFolder1 = escapePath(`/folder-1`)
  const treeItemFolder1 = page.locator(`.TreeItem[title$="${titleFolder1}"]`)
  await expect(treeItemFolder1).toBeFocused()

  // TODO test rename behavior
})
