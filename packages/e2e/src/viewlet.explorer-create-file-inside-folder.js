import { mkdir, writeFile } from 'fs/promises'
import { join } from 'node:path'
import { expect, getTmpDir, runWithExtension, test } from './_testFrameWork.js'

test.skip('viewlet.explorer-create-file-inside-folder', async () => {
  const tmpDir = await getTmpDir()
  await mkdir(`${tmpDir}/folder-1`, { recursive: true })
  await mkdir(`${tmpDir}/folder-2`, { recursive: true })
  await mkdir(`${tmpDir}/folder-3`, { recursive: true })
  await writeFile(join(tmpDir, 'folder-2', 'a.txt'), '')
  await writeFile(join(tmpDir, 'folder-2', 'b.txt'), '')
  await writeFile(join(tmpDir, 'folder-2', 'c.txt'), '')
  const page = await runWithExtension({
    folder: tmpDir,
    name: '',
  })
  const explorer = page.locator('.Explorer')
  const explorerFolder2 = explorer.locator('text=folder-2')
  await explorerFolder2.click({
    button: 'right',
  })
  const menuItemNewFile = page.locator('text=New File')
  await menuItemNewFile.click()

  const inputBox = explorer.locator('input')
  await expect(inputBox).toBeVisible()
  await expect(inputBox).toBeFocused()

  await inputBox.type('created.txt')
  await page.keyboard.press('Enter')

  const newFile = explorer.locator('text=created.txt')
  await expect(newFile).toBeVisible()
  await expect(newFile).toHaveAttribute('aria-setsize', '4')
  await expect(newFile).toHaveAttribute('aria-posinset', '4')
  await expect(newFile).toHaveAttribute('aria-level', '2')
})
