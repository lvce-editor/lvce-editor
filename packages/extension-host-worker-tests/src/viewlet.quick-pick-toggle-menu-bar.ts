import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.quick-pick-toggle-menu-bar'

export const test: Test = async ({ expect, Locator, QuickPick }) => {
  const menuBar = Locator('.TitleBarMenuBar')
  await expect(menuBar).toBeVisible()

  await QuickPick.open()
  await QuickPick.setValue('>menu bar')

  const toggleMenuBar = Locator('.QuickPickItem', { hasText: 'View: Toggle Menu Bar' })
  await expect(toggleMenuBar).toHaveCount(1)

  await QuickPick.selectItem('View: Toggle Menu Bar')
  await expect(menuBar).toHaveCount(0)

  await QuickPick.open()
  await QuickPick.setValue('>menu bar')
  await QuickPick.selectItem('View: Toggle Menu Bar')
  await expect(menuBar).toBeVisible()
}
