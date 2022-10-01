test('viewlet.title-bar-menu-bar-keyboard-navigation', async () => {
  // act
  await TitleBarMenuBar.focus()

  // assert
  const titleBarItemFile = Locator('.TitleBarTopLevelEntry', {
    hasText: 'File',
  })
  await expect(titleBarItemFile).toBeFocused()

  // act
  await TitleBarMenuBar.handleKeyArrowDown()

  // assert
  const menu0 = Locator('#Menu-0')
  await expect(menu0).toBeVisible()
  const menuItemOpenFolder = Locator('.MenuItem:text("Open Folder")')
  await expect(menuItemOpenFolder).toBeFocused()

  // act
  await TitleBarMenuBar.handleKeySpace()

  // assert
  await expect(titleBarItemFile).toBeFocused()

  // act
  await TitleBarMenuBar.handleKeyArrowRight()

  // assert
  const titleBarItemEdit = Locator('.TitleBarTopLevelEntry:text("Edit")')
  await expect(titleBarItemEdit).toBeFocused()

  // act
  await TitleBarMenuBar.handleKeyArrowDown()

  // assert
  await expect(menu0).toBeVisible()
  const menuItemCut = Locator('.MenuItem:text("Cut")')
  await expect(menuItemCut).toBeFocused()

  // act
  await TitleBarMenuBar.handleKeyEnd()

  // assert
  const menuItemPaste = Locator('.MenuItem:text("Paste")')
  await expect(menuItemPaste).toBeFocused()

  // act
  await TitleBarMenuBar.handleKeyHome()
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
