import { writeFile } from 'fs/promises'
import { expect, getTmpDir, runWithExtension, test } from './_testFrameWork.js'

test('viewlet.title-bar-keyboard-navigation', async () => {
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

  await page.keyboard.press('Control+Shift+P')
  const quickPick = page.locator('#QuickPick')
  const quickPickInputBox = quickPick.locator('.InputBox')
  await expect(quickPickInputBox).toHaveValue('>')
  await quickPickInputBox.type('Focus: Title Bar')
  const quickPickItemFocusTitleBar = page.locator('.QuickPickItem', {
    hasText: 'Focus: Title Bar',
  })

  const titleBar = page.locator('#TitleBar')
  const titleBarItemFile = titleBar.locator(
    '.TitleBarTopLevelEntry:text("File")'
  )
  await expect(titleBarItemFile).toBeFocused()

  await page.keyboard.press('ArrowDown')
  const menu0 = page.locator('#Menu-0')
  await expect(menu0).toBeVisible()
  const menuItemOpenFolder = page.locator('.MenuItem:text("Open Folder")')
  await expect(menuItemOpenFolder).toBeFocused()

  await page.keyboard.press('Escape')
  await expect(titleBarItemFile).toBeFocused()

  await page.keyboard.press('ArrowRight')
  const titleBarItemEdit = titleBar.locator(
    '.TitleBarTopLevelEntry:text("Edit")'
  )
  await expect(titleBarItemEdit).toBeFocused()

  await page.keyboard.press('ArrowDown')
  await expect(menu0).toBeVisible()
  const menuItemCut = page.locator('.MenuItem:text("Cut")')
  await expect(menuItemCut).toBeFocused()
  await page.keyboard.press('End')
  const menuItemPaste = page.locator('.MenuItem:text("Paste")')
  await expect(menuItemPaste).toBeFocused()
  await page.keyboard.press('Home')
  await expect(menuItemCut).toBeFocused()

  // await page.keyboard.press('ArrowLeft')

  // const menu = page.locator('#Menu-0')
  // await expect(menu).toBeFocused()

  // await page.waitForTimeout(1000)
  // await page.keyboard.press('ArrowDown')
  // const menuItemOpenFolder = menu.locator('text="Open Folder"')
  // await expect(menuItemOpenFolder).toBeFocused()

  // const activityBar = page.locator('#ActivityBar')
  // const sideBarTitleAreaTitle = page.locator('#SideBarTitleAreaTitle')

  // const activityBarItemExplorer = activityBar.locator('[title="Explorer"]')
  // await expect(sideBarTitleAreaTitle).toHaveText('Explorer')
  // await expect(activityBarItemExplorer).toBeFocused()

  // await page.keyboard.press('ArrowDown')
  // const activityBarItemSearch = activityBar.locator('[title="Search"]')
  // await expect(activityBarItemSearch).toBeFocused()

  // await page.keyboard.press('Enter')
  // await expect(activityBarItemSearch).toBeFocused()
  // await expect(sideBarTitleAreaTitle).toHaveText('Search')

  // await page.keyboard.press('ArrowDown')
  // const activityBarItemSourceControl = activityBar.locator(
  //   '[title="Source Control"]'
  // )
  // await expect(activityBarItemSourceControl).toBeFocused()

  // await page.keyboard.press('Shift+Tab')
  // const viewletSearchInput = page.locator(`.ViewletSearchInput`)
  // await expect(viewletSearchInput).toBeFocused()
  // await page.keyboard.press('Tab')
  // await expect(activityBarItemSourceControl).toBeFocused()

  // await page.keyboard.press('Enter')
  // await expect(activityBarItemSourceControl).toBeFocused()
  // await expect(sideBarTitleAreaTitle).toHaveText('Source Control')

  // await page.keyboard.press('ArrowUp')
  // await expect(activityBarItemSearch).toBeFocused()

  // const activityBarItemSettings = activityBar.locator('[title="Settings"]')
  // await page.keyboard.press('End')
  // await expect(activityBarItemSettings).toBeFocused()

  // await page.keyboard.press('Enter')

  // const contextMenu = page.locator('#ContextMenu')
  // await expect(contextMenu).toBeVisible()
  // await expect(contextMenu).toBeFocused()

  // await page.keyboard.press('Escape')
  // await expect(contextMenu).toBeHidden()
  // await expect(activityBarItemSettings).toBeFocused()

  // await page.keyboard.press('Home')
  // await expect(activityBarItemExplorer).toBeFocused()

  // await page.keyboard.press('End')
  // await expect(activityBarItemSettings).toBeFocused()

  // await page.keyboard.press('Space')
  // await expect(contextMenu).toBeFocused()

  // await page.keyboard.press('ArrowDown')
  // await page.keyboard.press('ArrowDown')
  // await page.keyboard.press('ArrowDown')
  // const contextMenuItemColorTheme = contextMenu.locator('text=Color Theme')
  // await expect(contextMenuItemColorTheme).toBeFocused()
  // await page.keyboard.press('Enter')

  // await expect(quickPickInputBox).toBeFocused()
})
