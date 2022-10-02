// manual accessibility tests

// focus menu bar
// nvda says: ""
// windows narrator says: ""
// orca says: "File collapsed, opens menu"

// expand file menu
// nvda says: ""
// windows narrator says: ""
// orca says: "Expanded, menu, new file"

test('viewlet.title-bar-menu-bar-keyboard-navigation', async () => {
  // assert
  const titleBarMenuBar = Locator('#TitleBarMenuBar')
  await expect(titleBarMenuBar).toHaveAttribute('role', 'menubar')
  await expect(titleBarMenuBar).toHaveAttribute('tabindex', '0')

  // act
  await TitleBarMenuBar.focus()

  // assert
  await expect(titleBarMenuBar).toBeFocused()
  await expect(titleBarMenuBar).toHaveAttribute(
    'aria-activedescendant',
    'TitleBarEntryActive'
  )
  const titleBarItemFile = Locator('.TitleBarTopLevelEntry', {
    hasText: 'File',
  })
  await expect(titleBarItemFile).toHaveAttribute('id', 'TitleBarEntryActive')
  await expect(titleBarItemFile).toHaveAttribute('aria-haspopup', 'true')
  await expect(titleBarItemFile).toHaveAttribute('aria-expanded', 'false')
  await expect(titleBarItemFile).toHaveAttribute('role', 'menuitem')

  // act
  await TitleBarMenuBar.handleKeyArrowDown()

  // assert
  const menu0 = Locator('#Menu-0')
  await expect(titleBarItemFile).toHaveAttribute('aria-expanded', 'true')
  await expect(titleBarItemFile).toHaveAttribute('aria-owns', 'Menu-0')
  await expect(menu0).toBeVisible()
  const menuItemNewFile = Locator('.MenuItem', { hasText: 'New File' })
  await expect(menuItemNewFile).toBeFocused()

  // act
  await TitleBarMenuBar.handleKeyEnd()
  await TitleBarMenuBar.handleKeyArrowUp()
  const menuItemOpenRecent = Locator('.MenuItem', { hasText: 'Open Recent' })
  await expect(menuItemOpenRecent).toBeFocused()

  // act
  await TitleBarMenuBar.handleKeyArrowRight()

  // assert
  const menu1 = Locator('#Menu-1')
  const menuItem1 = menu1.locator('.MenuItem.Focused')
  await expect(menuItem1).toBeFocused()
  await expect(menuItemOpenRecent).toHaveAttribute('aria-expanded', 'true')
  await expect(menuItemOpenRecent).toHaveAttribute('aria-owns', 'Menu-1')

  console.log('arrow left')
  // act
  await TitleBarMenuBar.handleKeyArrowLeft()

  // assert
  await expect(menuItemOpenRecent).toHaveAttribute('aria-expanded', 'false')
  await expect(menuItemOpenRecent).toHaveAttribute('aria-owns', null)
  await expect(menuItemOpenRecent).toBeFocused()

  // act
  await TitleBarMenuBar.handleKeyEscape()

  // assert
  await expect(titleBarMenuBar).toBeFocused()
  await expect(titleBarItemFile).toHaveAttribute('id', 'TitleBarEntryActive')
  await expect(titleBarItemFile).toHaveAttribute('aria-expanded', 'false')
  await expect(titleBarItemFile).toHaveAttribute('aria-owns', null)
})
