import { writeFile } from 'fs/promises'
import { expect, getTmpDir, runWithExtension, test } from './_testFrameWork.js'

test('viewlet.explorer-delete-file', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await writeFile(`${tmpDir}/file3.txt`, 'content 3')
  const page = await runWithExtension({
    folder: tmpDir,
    name: '',
  })
  const explorer = page.locator('.Viewlet[data-viewlet-id="Explorer"]')
  const file1 = explorer.locator('text=file1.txt')
  await file1.click({
    button: 'right',
  })
  const deleteMenuItem = page.locator('text=delete')
  await deleteMenuItem.click()
  await expect(file1).toBeHidden()
})
