import { writeFile } from 'fs/promises'
import { expect, getTmpDir, runWithExtension, test } from './_testFrameWork.js'

test('viewlet.title-bar-close-on-blur', async () => {
  const tmpDir = await getTmpDir()
  await writeFile(`${tmpDir}/test.txt`, 'div')
  const page = await runWithExtension({
    folder: tmpDir,
    name: '',
  })
  const testTxt = page.locator('text=test.txt')
  await testTxt.click()
  const tokenText = page.locator('.Token.Text')
  await tokenText.click()

  const titleBar = page.locator('#TitleBar')
  await expect(titleBar).toHaveAttribute('role', 'contentinfo')
  const titleBarMenuBar = page.locator('#TitleBarMenu')
  const menuItemFile = titleBarMenuBar.locator('.TitleBarTopLevelEntry', {
    hasText: 'File',
  })
  await menuItemFile.click()

  const menu = page.locator('#Menu-0')
  await expect(menu).toBeVisible()
  // await expect(menu).toBeFocused()

  const activityBar = page.locator('#ActivityBar')
  await activityBar.click()
  await expect(menu).toBeHidden()
})
