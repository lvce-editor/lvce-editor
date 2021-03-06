import { writeFile } from 'fs/promises'
import { expect, getTmpDir, runWithExtension, test } from './_testFrameWork.js'

// TODO test is flaky https://github.com/lvce-editor/lvce-editor/runs/7198459873?check_suite_focus=true
test.skip('viewlet.explorer-create-file', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await writeFile(`${tmpDir}/file3.txt`, 'content 3')
  const page = await runWithExtension({
    folder: tmpDir,
    name: '',
  })
  const explorer = page.locator('.Viewlet[data-viewlet-id="Explorer"]')
  await explorer.click({
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
})
