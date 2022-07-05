import { writeFile } from 'fs/promises'
import { expect, getTmpDir, runWithExtension, test } from './_testFrameWork.js'

test('viewlet.explorer-create=file-error-no-name-provided', async () => {
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

  await page.keyboard.press('Enter')

  // TODO there should be an error message below the input box
  const dialog = page.locator('#Dialog')
  const errorMessage = dialog.locator('#DialogBodyErrorMessage')
  await expect(errorMessage).toHaveText('Error: file name must not be empty')
})
