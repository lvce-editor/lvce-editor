import { writeFile } from 'fs/promises'
import { join } from 'node:path'
import { expect, getTmpDir, runWithExtension, test } from './_testFrameWork.js'

/**
 *
 * @param {any} page
 * @param {string } fileName
 */
const openFile = async (page, fileName) => {
  const testTxt = page.locator(`text=${fileName}`)
  await testTxt.click()
  const tokenText = page.locator('.Token.Text').first()
  await tokenText.click()
  const cursor = page.locator('.EditorCursor')
  await expect(cursor).toHaveCount(1)
  await expect(cursor).toHaveCSS('top', '0px')
  await expect(cursor).toHaveCSS('left', '36px')
}

test('sample.title-bar-toggle-block-comment-error-language-configuration-not-found', async () => {
  const tmpDir1 = await getTmpDir('folder-1')
  await writeFile(join(tmpDir1, 'test.test-html'), 'content-1')
  const page = await runWithExtension({
    folder: tmpDir1,
    name: '',
  })

  await openFile(page, 'test.test-html')
  const editor = page.locator('.Editor')
  await expect(editor).toHaveText('content-1')

  const titleBar = page.locator('#TitleBar')
  const titleBarEntryEdit = titleBar.locator('text=Edit')
  await titleBarEntryEdit.click()

  const menus = page.locator('.Menu')

  await expect(menus).toHaveCount(1)
  const menu = menus.nth(0)
  await expect(menu).toBeVisible()
  const menuItemOpenToggleBlockComment = menu.locator(
    'text=Toggle Block Comment'
  )
  await menuItemOpenToggleBlockComment.click()

  // await expect(editor).toHaveText('<!--content-1-->')
})
