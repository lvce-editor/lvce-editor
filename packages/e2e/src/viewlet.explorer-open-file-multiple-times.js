import { writeFile } from 'fs/promises'
import { expect, getTmpDir, runWithExtension, test } from './_testFrameWork.js'

test.skip('viewlet.explorer-open-file-multiple-times', async () => {
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
  await file2.click()

  const main = page.locator('#Main')
  const tabs = main.locator('.MainTab')

  const editor = main.locator('.Editor')
  await expect(editor).toHaveCount(1)
  await expect(editor).toHaveText('content 2')

  await file2.click()

  await expect(tabs).toHaveCount(1)

  const file3 = explorer.locator('text=file3.txt')
  await file3.click()

  await expect(tabs).toHaveCount(2)
  const firstTab = tabs.first()
  await expect(firstTab).toHaveText('file2.txt')
  const secondTab = tabs.nth(1)
  await expect(secondTab).toHaveText('file3.txt')

  await expect(editor).toHaveCount(1)
  await expect(editor).toHaveText('content 3')
})
