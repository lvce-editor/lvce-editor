// manual accessibility tests

// focus menu bar
// nvda says: ""
// windows narrator says: ""
// orca says: "File collapsed, opens menu"

// expand file menu
// nvda says:  "References Tree View"
// windows narrator says:  "References Tree"
// orca says:  "References Tree"

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
  await TitleBarMenuBar.handleKeyEscape()

  // assert
  await expect(titleBarItemFile).toHaveAttribute('id', 'TitleBarEntryActive')
  await expect(titleBarItemFile).toHaveAttribute('aria-expanded', 'false')
  await expect(titleBarItemFile).toHaveAttribute('aria-owns', null)

  // act
  await TitleBarMenuBar.handleKeyArrowRight()

  // assert
  const titleBarItemEdit = Locator('.TitleBarTopLevelEntry', {
    hasText: 'Edit',
  })
  await expect(titleBarItemEdit).toHaveAttribute('id', 'TitleBarEntryActive')
})
