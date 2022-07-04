import { writeFile } from 'fs/promises'
import { getTmpDir, runWithExtension, test, expect } from './_testFrameWork.js'

test('viewlet.explorer-create-file-and-type', async () => {
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

  // const newFile = explorer.locator('text=created.txt')
  // await expect(newFile).toBeVisible()

  // await newFile.click()

  // const main = page.locator('#Main')
  // const tab = main.locator('.MainTab')
  // await expect(tab).toHaveCount(1)
  // await expect(tab).toHaveText('created.txt')

  // const editor = main.locator('.Editor')
  // await expect(editor).toHaveText('')

  // const editorRows = editor.locator('.EditorRows')
  // await editorRows.click({
  //   position: {
  //     x: 0,
  //     y: 5,
  //   },
  // })

  // const cursor = page.locator('.EditorCursor')
  // await expect(cursor).toHaveCount(1)
  // await expect(cursor).toHaveCSS('top', '0px')
  // await expect(cursor).toHaveCSS('left', '0px')

  // await page.keyboard.type('abc')
  // await expect(editor).toHaveText('abc')
})
