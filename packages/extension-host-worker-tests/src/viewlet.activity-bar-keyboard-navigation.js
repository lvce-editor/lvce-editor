test('viewlet.activity-bar-keyboard-navigation', async () => {
  // act
  await ActivityBar.focus()

  // assert
  const activityBarItemExplorer = Locator('.ActivityBarItem[title="Explorer"]')
  await expect(activityBarItemExplorer).toHaveClass('FocusOutline')
  const sideBarHeaderTitle = Locator('#SideBarTitleAreaTitle')
  await expect(sideBarHeaderTitle).toHaveText('Explorer')

  // act
  await ActivityBar.focusNext()

  // assert
  const activityBarItemSearch = Locator('.ActivityBarItem[title="Search"]')
  await expect(activityBarItemSearch).toHaveClass('FocusOutline')

  // act
  await ActivityBar.selectCurrent()

  // assert
  await expect(sideBarHeaderTitle).toHaveText('Search')
  // TODO search input should be focused

  // act
  await ActivityBar.focusLast()

  // assert
  const activityBarItemSettings = Locator('.ActivityBarItem[title="Settings"]')
  await expect(activityBarItemSettings).toHaveClass('FocusOutline')

  // act
  await ActivityBar.selectCurrent()

  // assert
  const menu = Locator(`#Menu-0`)
  await expect(menu).toBeFocused()

  // TODO close menu with escape

  // act
  await ActivityBar.focusPrevious()

  // assert
  const activityBarItemExtensions = Locator(
    '.ActivityBarItem[title="Extensions"]'
  )
  await expect(activityBarItemExtensions).toHaveClass('FocusOutline')

  // act
  await ActivityBar.focusFirst()

  // assert
  await expect(activityBarItemExplorer).toHaveClass('FocusOutline')

  // act
  await ActivityBar.selectCurrent()

  // assert
  await expect(sideBarHeaderTitle).toHaveText('Explorer')

  // TODO explorer should be focused
})
