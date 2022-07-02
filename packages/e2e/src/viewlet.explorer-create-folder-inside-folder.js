import { mkdir, writeFile } from 'fs/promises'
import { join } from 'node:path'
import { expect, getTmpDir, runWithExtension, test } from './_testFrameWork.js'

test('viewlet.explorer-create=folder-inside-folder', async () => {
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
  const explorer = page.locator('.Viewlet[data-viewlet-id="Explorer"]')
  const explorerFolder2 = explorer.locator('text=folder-2')
  await explorerFolder2.click({
    button: 'right',
  })
  const menuItemNewFile = page.locator('text=New Folder')
  await menuItemNewFile.click()

  const inputBox = explorer.locator('input')
  await expect(inputBox).toBeVisible()
  await expect(inputBox).toBeFocused()

  await inputBox.type('created')
  await page.keyboard.press('Enter')

  const newFolder = explorer.locator('text=created')
  await expect(newFolder).toBeVisible()
  await expect(newFolder).toHaveAttribute('aria-setsize', '4')
  await expect(newFolder).toHaveAttribute('aria-posinset', '4')
  await expect(newFolder).toHaveAttribute('aria-level', '2')
})
