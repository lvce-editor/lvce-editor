import { writeFile } from 'fs/promises'
import { join } from 'node:path'
import { expect, getTmpDir, runWithExtension, test } from './_testFrameWork.js'

test('viewlet.title-bar-open-folder', async () => {
  const tmpDir1 = await getTmpDir()
  const tmpDir2 = await getTmpDir()
  await writeFile(join(tmpDir2, 'file.txt'), '')
  const page = await runWithExtension({
    folder: tmpDir1,
    name: '',
  })

  const titleBar = page.locator('#TitleBar')
  const titleBarEntryFile = titleBar.locator('text=File')
  await titleBarEntryFile.click()

  const menu = page.locator('.Menu')
  const menuItemOpenFolder = menu.locator('text=Open Folder')
  await menuItemOpenFolder.click()

  await expect(menu).toBeHidden()

  // if (useElectron) {
  //   // TODO
  // } else {
  const dialog = page.locator('#Dialog')
  const dialogInput = dialog.locator('input')
  await dialogInput.type(tmpDir2)
  const dialogButtonOk = dialog.locator('text=ok')
  await dialogButtonOk.click()
  // }
  const explorer = page.locator('.Viewlet[data-viewlet-id="Explorer"]')
  const explorerItemFile = explorer.locator('text=file.txt')
  await expect(explorerItemFile).toBeVisible()
})
