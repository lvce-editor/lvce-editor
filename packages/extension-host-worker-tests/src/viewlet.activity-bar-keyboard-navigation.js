test('viewlet.activity-bar-keyboard-navigation', async () => {
  // act
  await ActivityBar.focus()

  // assert
  const activityBarItemExplorer = Locator('.ActivityBarItem[title="Explorer"]')
  await expect(activityBarItemExplorer).toBeFocused()
  const sideBarHeaderTitle = Locator('#SideBarTitleAreaTitle')
  await expect(sideBarHeaderTitle).toHaveText('Explorer')

  // act
  await ActivityBar.focusNext()

  // assert
  const activityBarItemSearch = Locator('.ActivityBarItem[title="Search"]')
  await expect(activityBarItemSearch).toBeFocused()

  // act
  await ActivityBar.selectCurrent()

  // assert
  await expect(sideBarHeaderTitle).toHaveText('Search')
  // TODO search input should be focused

  // act
  await ActivityBar.focusLast()

  // assert
  const activityBarItemSettings = Locator('.ActivityBarItem[title="Settings"]')
  await expect(activityBarItemSettings).toBeFocused()

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
  await expect(activityBarItemExtensions).toBeFocused()

  // act
  await ActivityBar.focusFirst()

  // assert
  await expect(activityBarItemExplorer).toBeFocused()

  // act
  await ActivityBar.selectCurrent()

  // assert
  await expect(sideBarHeaderTitle).toHaveText('Explorer')

  // TODO explorer should be focused
})
