import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.quick-pick-layout'

export const test: Test = async ({ Command, expect, Locator }) => {
  await Command.execute('RecentlyOpened.clearRecentlyOpened')
  await Command.execute(
    'RecentlyOpened.addToRecentlyOpened',
    'remote-ssh://one.example/this-is-a-very-long-parent-directory-name/another-very-long-parent-directory-name/this-is-a-very-long-file-name-that-does-not-fit.txt',
  )
  await Command.execute('QuickPick.showRecent')

  const item = Locator('.QuickPickItem').nth(0)
  const icon = item.locator('.FileIcon')
  const description = item.locator('.QuickPickItemDescription')

  await expect(icon).toHaveCSS('flex-shrink', '0')
  await expect(icon).toHaveCSS('width', '16px')
  await expect(description).toHaveCSS('min-width', '0px')
  await expect(description).toHaveCSS('overflow', 'hidden')
  await expect(description).toHaveCSS('text-overflow', 'ellipsis')
  await expect(description).toHaveCSS('white-space', 'nowrap')
}
