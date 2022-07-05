import { writeFile } from 'fs/promises'
import { expect, getTmpDir, runWithExtension, test } from './_testFrameWork.js'

test.skip('viewlet.explorer-rename-file', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await writeFile(`${tmpDir}/file3.txt`, 'content 3')
  const page = await runWithExtension({
    folder: tmpDir,
    name: '',
  })
  const explorer = page.locator('.Viewlet[data-viewlet-id="Explorer"]')
  const file2 = explorer.locator('text=file2.txt')
  await file2.click({
    button: 'right',
  })
  const menuItemRename = page.locator('text=rename')
  await menuItemRename.click()

  const inputBox = explorer.locator('input')
  await expect(inputBox).toBeVisible()
  await expect(inputBox).toBeFocused()
  await inputBox.type('renamed.txt')
  await page.keyboard.press('Enter')

  const renamed = explorer.locator('text=renamed.txt')
  await expect(file2).toBeHidden()
  await expect(renamed).toBeVisible()
  await expect(renamed).toBeFocused()
})
