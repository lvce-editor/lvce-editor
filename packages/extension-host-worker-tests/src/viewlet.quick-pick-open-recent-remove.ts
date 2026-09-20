import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.quick-pick-open-recent-remove'

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('RecentlyOpened.clearRecentlyOpened')
  await Command.execute('RecentlyOpened.addToRecentlyOpened', 'remote-ssh://one.example/test/one')
  await Command.execute('RecentlyOpened.addToRecentlyOpened', 'remote-ssh://two.example/test/two')
  await Command.execute('QuickPick.showRecent')

  const items = Locator('.QuickPickItem')
  const firstItem = items.nth(0)
  const firstRemoveButton = firstItem.locator('.QuickPickItemRemove')
  const secondItem = items.nth(1)
  const secondRemoveButton = secondItem.locator('.QuickPickItemRemove')

  await expect(firstRemoveButton).toHaveCSS('display', 'none')
  await expect(firstRemoveButton).toHaveAttribute('aria-label', 'Remove from Recently Opened')
  await expect(firstRemoveButton).toHaveAttribute('data-uri', 'remote-ssh://two.example/test/two')
  await expect(secondRemoveButton).toHaveAttribute('data-uri', 'remote-ssh://one.example/test/one')

  // The test harness cannot synthesize native CSS :hover, so dispatch the real pointer event to the remove control.
  // eslint-disable-next-line @typescript-eslint/no-deprecated -- exercise the DOM event listener
  await firstRemoveButton.dispatchEvent('pointerdown', {
    bubbles: true,
    clientX: 0,
    clientY: 0,
  } as unknown as string)

  await expect(items).toHaveCount(1)
  const remainingItem = items.nth(0)
  const remainingLabel = remainingItem.locator('.QuickPickItemLabel')
  await expect(remainingLabel).toHaveText('one [SSH: one.example]')
  const recentlyOpened = await Command.execute('RecentlyOpened.getRecentlyOpened')
  if (JSON.stringify(recentlyOpened) !== JSON.stringify(['remote-ssh://one.example/test/one'])) {
    throw new Error(`Unexpected recently opened entries: ${JSON.stringify(recentlyOpened)}`)
  }
}
