test('viewlet.title-bar-menu-bar-keyboard-navigation', async () => {
  // act
  await TitleBarMenuBar.focus()

  // assert
  const titleBarItemFile = Locator('.TitleBarTopLevelEntry', {
    hasText: 'File',
  })
  await expect(titleBarItemFile).toHaveAttribute('id', 'TitleBarEntryActive')

  // act
  await TitleBarMenuBar.handleKeyArrowDown()

  // assert
  const menu0 = Locator('#Menu-0')
  await expect(menu0).toBeVisible()
  const menuItemNewFile = Locator('.MenuItem', { hasText: 'New File' })
  await expect(menuItemNewFile).toBeFocused()

  // act
  await TitleBarMenuBar.handleKeyEscape()

  // assert
  await expect(titleBarItemFile).toHaveAttribute('id', 'TitleBarEntryActive')

  // act
  await TitleBarMenuBar.handleKeyArrowRight()

  // assert
  const titleBarItemEdit = Locator('.TitleBarTopLevelEntry', {
    hasText: 'Edit',
  })
  await expect(titleBarItemEdit).toHaveAttribute('id', 'TitleBarEntryActive')

  // act
  await TitleBarMenuBar.handleKeyArrowDown()

  // assert
  await expect(menu0).toBeVisible()
  const menuItemCut = Locator('.MenuItem', {
    hasText: 'Cut',
  })
  await expect(menuItemCut).toBeFocused()

  // act
  await TitleBarMenuBar.handleKeyEnd()

  // assert
  const menuItemToggleBlockComment = Locator('.MenuItem', {
    hasText: 'Toggle Block Comment',
  })
  await expect(menuItemToggleBlockComment).toBeFocused()

  // act
  await TitleBarMenuBar.handleKeyHome()

  // assert
  await expect(menuItemCut).toBeFocused()

  // act
  await TitleBarMenuBar.handleKeyEscape()

  // assert
  await expect(titleBarItemEdit).toHaveAttribute('id', 'TitleBarEntryActive')

  // act
  await TitleBarMenuBar.handleKeyHome()

  // assert
  await expect(titleBarItemFile).toHaveAttribute('id', 'TitleBarEntryActive')

  // act
  await TitleBarMenuBar.handleKeyEnd()

  // assert
  const titleBarItemHelp = Locator('.TitleBarTopLevelEntry', {
    hasText: 'Help',
  })
  await expect(titleBarItemHelp).toHaveAttribute('id', 'TitleBarEntryActive')

  // act
  await TitleBarMenuBar.handleKeyArrowRight()

  // assert
  await expect(titleBarItemFile).toHaveAttribute('id', 'TitleBarEntryActive')

  // act
  await TitleBarMenuBar.handleKeyArrowDown()

  // assert
  await TitleBarMenuBar.handleKeyEnd()

  // assert
  const menuItemExit = Locator('.MenuItem', {
    hasText: 'Exit',
  })
  await expect(menuItemExit).toBeFocused()

  // act
  await TitleBarMenuBar.handleKeyArrowUp()

  // assert
  const menuItemOpenRecent = Locator('.MenuItem', {
    hasText: 'Open Recent',
  })
  await expect(menuItemOpenRecent).toBeFocused()

  await TitleBarMenuBar.handleKeyArrowRight()

  const menu1 = Locator('#Menu-1')
  await expect(menu1).toBeVisible()
})
