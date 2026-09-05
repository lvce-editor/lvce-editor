import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.quick-pick-builtin-commands'

export const test: Test = async ({ Command, expect, Locator, QuickPick }) => {
  await QuickPick.open()
  await QuickPick.setValue('>Layout: Toggle Side Bar')

  const toggleSideBar = Locator('.QuickPickItem', { hasText: 'Layout: Toggle Side Bar' })
  await expect(toggleSideBar).toBeVisible()

  await QuickPick.setValue('>Account: Sign In')
  const signIn = Locator('.QuickPickItem', { hasText: 'Account: Sign In' })
  await expect(signIn).toBeVisible()

  await QuickPick.setValue('>Change Language Mode')
  const changeLanguageMode = Locator('.QuickPickItem', { hasText: 'Change Language Mode' })
  await expect(changeLanguageMode).toBeVisible()

  await Command.execute('Viewlet.closeWidget', 'QuickPick')
}
