import { mkdir, writeFile } from 'fs/promises'
import { join } from 'node:path'
import { expect, getTmpDir, runWithExtension, test } from './_testFrameWork.js'

test.skip('viewlet.title-bar-open-recent-preserve-opened-folder-after-reload', async () => {
  const tmpDir1 = await getTmpDir('folder-1')
  const tmpDir2 = await getTmpDir('folder-2')
  await writeFile(join(tmpDir1, 'file-1.txt'), 'content-1')
  await writeFile(join(tmpDir2, 'file-2.txt'), 'content-2')
  const cacheDir = await getTmpDir()
  await mkdir(join(cacheDir, 'lvce-oss'))
  await writeFile(
    join(cacheDir, 'lvce-oss', 'recently-opened.json'),
    JSON.stringify([tmpDir1, tmpDir2])
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
  const subMenu = menus.nth(1)
  await expect(subMenu).toBeVisible()

  const subMenuItemOne = subMenu.locator('.MenuItem').nth(0)
  const subMenuItemTwo = subMenu.locator('.MenuItem').nth(1)
  await expect(subMenuItemOne).toHaveText(tmpDir1)
  await expect(subMenuItemTwo).toHaveText(tmpDir2)
  await subMenuItemTwo.click()

  const explorer = page.locator('.Explorer')
  const file2 = explorer.locator('text=file-2.txt')
  await expect(file2).toBeVisible()
  await expect(menus).toHaveCount(0)

  await page.reload()
  await expect(file2).toBeVisible()
})
