import { mkdir, writeFile } from 'fs/promises'
import { join } from 'node:path'
import { expect, getTmpDir, runWithExtension, test } from './_testFrameWork.js'

test('viewlet.explorer-expand-all', async () => {
  const tmpDir = await getTmpDir()
  await mkdir(`${tmpDir}/folder-1`, { recursive: true })
  await mkdir(`${tmpDir}/folder-2`, { recursive: true })
  await mkdir(`${tmpDir}/folder-3`, { recursive: true })
  await writeFile(join(tmpDir, 'folder-1', 'a.txt'), '')
  await writeFile(join(tmpDir, 'folder-1', 'b.txt'), '')
  await writeFile(join(tmpDir, 'folder-1', 'c.txt'), '')
  await writeFile(join(tmpDir, 'folder-2', 'a.txt'), '')
  await writeFile(join(tmpDir, 'folder-2', 'b.txt'), '')
  await writeFile(join(tmpDir, 'folder-2', 'c.txt'), '')
  await writeFile(join(tmpDir, 'folder-3', 'a.txt'), '')
  await writeFile(join(tmpDir, 'folder-3', 'b.txt'), '')
  await writeFile(join(tmpDir, 'folder-3', 'c.txt'), '')
  const page = await runWithExtension({
    folder: tmpDir,
    name: '',
  })
  const explorer = page.locator('.Viewlet[data-viewlet-id="Explorer"]')
  await explorer.click()

  await expect(explorer).toBeFocused()

  await page.keyboard.press('ArrowDown')
  const folder1 = explorer.locator('text=folder-1')
  await expect(folder1).toHaveClass(/FocusOutline/)

  await page.keyboard.press('Shift+*')

  const items = explorer.locator('.TreeItem')
  await expect(items).toHaveCount(12)

  const itemOne = items.nth(0)
  const itemTwo = items.nth(1)
  const itemThree = items.nth(2)
  const itemFour = items.nth(3)
  const itemFive = items.nth(4)
  const itemSix = items.nth(5)
  const itemSeven = items.nth(6)
  const itemEight = items.nth(7)
  const itemNine = items.nth(8)
  const itemTen = items.nth(9)
  const itemEleven = items.nth(10)
  const itemTwelve = items.nth(11)
  await expect(itemOne).toHaveText('folder-1')
  await expect(itemTwo).toHaveText('a.txt')
  await expect(itemThree).toHaveText('b.txt')
  await expect(itemFour).toHaveText('c.txt')
  await expect(itemFive).toHaveText('folder-2')
  await expect(itemSix).toHaveText('a.txt')
  await expect(itemSeven).toHaveText('b.txt')
  await expect(itemEight).toHaveText('c.txt')
  await expect(itemNine).toHaveText('folder-3')
  await expect(itemTen).toHaveText('a.txt')
  await expect(itemEleven).toHaveText('b.txt')
  await expect(itemTwelve).toHaveText('c.txt')
})
