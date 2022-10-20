import { mkdir, writeFile } from 'fs/promises'
import { join } from 'node:path'
import { expect, getTmpDir, runWithExtension, test } from './_testFrameWork.js'

test.skip('viewlet.title-bar-open-recent-add-folder-to-top-of-list', async () => {
  const tmpDir1 = await getTmpDir('folder-1')
  const tmpDir2 = await getTmpDir('folder-2')
  const tmpDir3 = await getTmpDir('folder-3')
  await writeFile(join(tmpDir1, 'file-1.txt'), 'content-1')
  await writeFile(join(tmpDir2, 'file-2.txt'), 'content-2')
  await writeFile(join(tmpDir3, 'file-3.txt'), 'content-3')
  const cacheDir = await getTmpDir()
  await mkdir(join(cacheDir, 'lvce-oss'))
  await writeFile(
    join(cacheDir, 'lvce-oss', 'recently-opened.json'),
    JSON.stringify([tmpDir1, tmpDir2, tmpDir3])
  )
  const configDir = await getTmpDir()
  await mkdir(join(configDir, 'lvce-oss'))
  await writeFile(
    join(configDir, 'lvce-oss', 'settings.json'),
    JSON.stringify({
      'workbench.saveStateOnVisibilityChange': true,
    })
  )
  const page = await runWithExtension({
    folder: tmpDir1,
    env: {
      XDG_CONFIG_HOME: configDir,
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
  await menuItemOpenRecent.click()

  await expect(menus).toHaveCount(2)
  const subMenu = page.locator('#Menu-1')
  await expect(subMenu).toBeVisible()

  const subMenuItems = subMenu.locator('.MenuItem')
  const subMenuItemOne = subMenuItems.nth(0)
  const subMenuItemTwo = subMenuItems.nth(1)
  const subMenuItemThree = subMenuItems.nth(2)
  await expect(subMenuItemOne).toHaveText(tmpDir1)
  await expect(subMenuItemTwo).toHaveText(tmpDir2)
  await expect(subMenuItemThree).toHaveText(tmpDir3)
  await subMenuItemThree.click()

  const explorer = page.locator('.Explorer')
  const file3 = explorer.locator('text=file-3.txt')
  await expect(file3).toBeVisible()
  await expect(menus).toHaveCount(0)

  await page.reload()
  await expect(file3).toBeVisible()
  await titleBarEntryFile.click()
  await menuItemOpenRecent.click()
  await expect(subMenuItemOne).toHaveText(tmpDir3)
  await expect(subMenuItemTwo).toHaveText(tmpDir1)
  await expect(subMenuItemThree).toHaveText(tmpDir2)
})
