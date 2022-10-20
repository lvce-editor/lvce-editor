import { writeFile } from 'fs/promises'
import { expect, getTmpDir, runWithExtension, test } from './_testFrameWork.js'

test.skip('viewlet.explorer-delete-multiple-files', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await writeFile(`${tmpDir}/file3.txt`, 'content 3')
  const page = await runWithExtension({
    folder: tmpDir,
    name: '',
  })
  const explorer = page.locator('.Explorer')
  const file1 = explorer.locator('text=file1.txt')
  const file2 = explorer.locator('text=file2.txt')
  const file3 = explorer.locator('text=file3.txt')

  await explorer.click()
  await expect(explorer).toHaveClass(/FocusOutline/)

  await page.keyboard.press('ArrowUp')
  await expect(file3).toHaveClass(/FocusOutline/)

  await page.keyboard.press('Delete')
  await expect(file3).toBeHidden()
  await expect(file2).toHaveClass(/FocusOutline/)

  await page.keyboard.press('Delete')
  await expect(file2).toBeHidden()
  await expect(file1).toHaveClass(/FocusOutline/)

  await page.keyboard.press('Delete')
  await expect(file1).toBeHidden()
  await expect(explorer).toHaveClass(/FocusOutline/)
})
