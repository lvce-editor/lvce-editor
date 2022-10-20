import { mkdir, rm, writeFile } from 'fs/promises'
import { join } from 'node:path'
import { expect, getTmpDir, runWithExtension, test } from './_testFrameWork.js'

test.skip('viewlet.explorer-create-file-inside-folder-error-folder-was-removed', async () => {
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
  await rm(join(tmpDir, 'folder-2'), { recursive: true })
  await page.keyboard.press('Enter')

  // TODO better error message, also shouldn't be a modal dialog
  const dialogTitle = page.locator('#DialogTitle')
  await expect(dialogTitle).toHaveText('File System Error')
  const dialogBodyErrorMessage = page.locator('#DialogBodyErrorMessage')
  const newFilePath = join(tmpDir, 'folder-2', 'created.txt')
  await expect(dialogBodyErrorMessage).toHaveText(
    `Error: Failed to write to file "${newFilePath}": ENOENT: no such file or directory, open '${newFilePath}'`
  )
})
