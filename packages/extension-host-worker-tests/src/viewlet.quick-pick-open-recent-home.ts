import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.quick-pick-open-recent-home'

export const test: Test = async ({ Command, expect, Locator, QuickPick }) => {
  const homeDir = await Command.execute('Workspace.getHomeDir')
  await Command.execute('RecentlyOpened.clearRecentlyOpened')
  await Command.execute('RecentlyOpened.addToRecentlyOpened', `file://${homeDir}/Documents/levivilet`)
  await Command.execute('RecentlyOpened.addToRecentlyOpened', `file://${homeDir}ish/Documents/levivilet`)

  await Command.execute('QuickPick.showRecent')
  await QuickPick.setValue('levivilet')

  const descriptions = Locator('.QuickPickItemDescription')
  const firstDescription = descriptions.nth(0)
  const secondDescription = descriptions.nth(1)
  await expect(firstDescription).toHaveText(`${homeDir}ish/Documents`)
  await expect(secondDescription).toHaveText('~/Documents')
}
