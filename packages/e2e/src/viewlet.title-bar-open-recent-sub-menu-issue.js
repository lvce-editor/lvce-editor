import { mkdir, writeFile } from 'fs/promises'
import { join } from 'node:path'
import { expect, getTmpDir, runWithExtension, test } from './_testFrameWork.js'

test('viewlet.title-bar-open-recent-sub-menu-issue', async () => {
  const tmpDir = await getTmpDir()
  const cacheDir = await getTmpDir()
  await mkdir(join(cacheDir, 'lvce-oss'))
  await writeFile(
    join(cacheDir, 'lvce-oss', 'recently-opened.json'),
    JSON.stringify([])
  )
  const page = await runWithExtension({
    folder: tmpDir,
    env: {
      XDG_CACHE_HOME: cacheDir,
    },
    name: '',
  })

  const titleBar = page.locator('#TitleBar')
  const titleBarEntryFile = titleBar.locator('text=File')
  await titleBarEntryFile.click()

  const menus = page.locator('.Menu')

  await expect(menus).toHaveCount(1)
  const menu = menus.nth(0)
  await expect(menu).toBeVisible()
  const menuItemOpenRecent = menu.locator('text=Open Recent')
  const rect = await menuItemOpenRecent.boundingBox()
  if (!rect) {
    throw new Error('expected bounding box to be defined')
  }

  await page.mouse.move(rect.x + rect.width - 1, rect.y + rect.height - 1)
  await expect(menus).toHaveCount(2)
  const subMenu = page.locator('#Menu-1')
  await expect(subMenu).toBeVisible()

  await page.mouse.move(rect.x + rect.width - 1, rect.y + rect.height + 1)
  await expect(subMenu).toBeVisible()

  const itemMore = subMenu.locator('text=More...')
  await itemMore.hover()

  await page.mouse.move(rect.x + rect.width - 5, rect.y + rect.height + 1)
  await expect(subMenu).toBeHidden()
})
