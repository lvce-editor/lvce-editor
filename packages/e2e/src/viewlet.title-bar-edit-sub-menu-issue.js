import { mkdir, writeFile } from 'fs/promises'
import { join } from 'node:path'
import { expect, getTmpDir, runWithExtension, test } from './_testFrameWork.js'

test('viewlet.title-bar-edit-sub-menu-issue', async () => {
  const tmpDir = await getTmpDir()
  const cacheDir = await getTmpDir()
  await mkdir(join(cacheDir, 'lvce-oss'))
  await writeFile(
    join(cacheDir, 'lvce-oss', 'recently-opened.json'),
    JSON.stringify([])
  )
  const page = await runWithExtension({
    folder: tmpDir,
    name: '',
    env: {
      XDG_CACHE_HOME: cacheDir,
    },
  })

  const titleBar = page.locator('#TitleBar')
  const titleBarEntryFile = titleBar.locator('text=File')
  await titleBarEntryFile.click()

  const menus = page.locator('.Menu')

  await expect(menus).toHaveCount(1)
  const menu = menus.nth(0)
  await expect(menu).toBeVisible()
  await expect(menu).toContainText('Open Folder')

  const fileRect = await titleBarEntryFile.boundingBox()
  if (!fileRect) {
    throw new Error('expected bounding box to be defined')
  }

  // move to center of menu entry file
  await page.mouse.move(
    Math.round(fileRect.x + fileRect.width / 2),
    Math.round(fileRect.y + fileRect.height / 2)
  )

  const titleBarEntryEdit = titleBar.locator('text=Edit')

  const editRect = await titleBarEntryEdit.boundingBox()
  if (!editRect) {
    throw new Error('expected bounding box to be defined')
  }

  // move to bottom left of menu entry edit
  await page.mouse.move(
    Math.round(editRect.x + 5),
    Math.round(editRect.y + editRect.height - 5)
  )

  // TODO file menu should stay open at this point
  await expect(menu).toContainText('Open Folder')
})
