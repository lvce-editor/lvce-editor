import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.activity-bar-source-control-selected-with-badge'

const waitFor = async (assertion: () => Promise<void>): Promise<void> => {
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      await assertion()
      return
    } catch (error) {
      if (attempt === 99) {
        throw error
      }
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
}

export const test: Test = async ({ Command, expect, Locator, SideBar }) => {
  const sourceControlItem = Locator('.ActivityBarItem[title="Source Control"]')
  const badge = sourceControlItem.locator('.ActivityBarItemBadge')
  await Command.execute('Layout.setBadgeCount', 'Source Control', 2)
  await SideBar.open('Explorer')

  await sourceControlItem.click()
  await waitFor(() => expect(sourceControlItem).toHaveAttribute('aria-selected', 'true'))

  await expect(badge).toHaveText('2')
  await expect(sourceControlItem).toHaveCSS('background-color', 'rgb(31, 39, 39)')
}
