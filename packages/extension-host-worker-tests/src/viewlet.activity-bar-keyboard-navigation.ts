export const name = 'viewlet.activity-bar-keyboard-navigation'

export const test = async ({ KeyBoard, Locator, expect }) => {
  // act
  const activityBar = Locator('#ActivityBar')
  await activityBar.click()

  // assert
  const activityBarItemExplorer = Locator('.ActivityBarItem[title="Explorer"]')
  await expect(activityBarItemExplorer).toHaveClass('FocusOutline')
  const sideBarHeaderTitle = Locator('.SideBarTitleAreaTitle')
  await expect(sideBarHeaderTitle).toHaveText('Explorer')

  // act
  await KeyBoard.press('ArrowDown')

  // assert
  const activityBarItemSearch = Locator('.ActivityBarItem[title="Search"]')
  await expect(activityBarItemSearch).toHaveClass('FocusOutline')

  // act
  await KeyBoard.press('ArrowUp')

  // assert
  await expect(activityBarItemExplorer).toHaveClass('FocusOutline')

  // act
  await KeyBoard.press('End')

  // assert
  const activityBarItemSettings = Locator('.ActivityBarItem[title="Settings"]')
  await expect(activityBarItemSettings).toHaveClass('FocusOutline')

  // act
  await KeyBoard.press('Home')

  // assert
  await expect(activityBarItemExplorer).toHaveClass('FocusOutline')

  // act
  await KeyBoard.press('ArrowDown')
  await KeyBoard.press('Enter')

  // assert
  await expect(sideBarHeaderTitle).toHaveText('Search')

  // act
  await activityBar.click()
  await expect(activityBarItemSearch).toHaveClass('FocusOutline')
  await KeyBoard.press('End')
  await expect(activityBarItemSettings).toHaveClass('FocusOutline')
  await KeyBoard.press('Space')

  // assert
  const menu = Locator('#Menu-0')
  await expect(menu).toBeFocused()
}
