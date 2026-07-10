export const name = 'viewlet.title-bar-editor-layout-split-left'

export const test = async ({ Command, Main, TitleBarMenuBar, Locator, expect }) => {
  await TitleBarMenuBar.focus()
  await TitleBarMenuBar.handleKeyArrowRight()
  await TitleBarMenuBar.handleKeyArrowRight()
  await TitleBarMenuBar.handleKeyArrowRight()
  await TitleBarMenuBar.handleKeyArrowDown()
  await Command.execute('TitleBar.handleMenuClick', 0, 4)

  const item = Locator('#Menu-1 .MenuItem', { hasText: 'Split Left' })
  await expect(item).toBeVisible()
  await Command.execute('TitleBar.handleMenuClick', 1, 2)
  await expect(item).toBeHidden()
  await Main.shouldHaveLayout({
    activeGroupIndex: 0,
    direction: 'horizontal',
    groups: [{ size: 50 }, { size: 50 }],
  })
}
