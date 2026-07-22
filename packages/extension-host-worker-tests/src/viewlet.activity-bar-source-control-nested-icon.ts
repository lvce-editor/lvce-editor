import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.activity-bar-source-control-nested-icon'

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

export const test: Test = async ({ expect, Locator, SideBar }) => {
  const sourceControlItem = Locator('.ActivityBarItem[title="Source Control"]')
  await SideBar.open('Explorer')

  await sourceControlItem.click()
  await waitFor(() => expect(sourceControlItem).toHaveAttribute('aria-selected', 'true'))

  const sourceControlIcon = sourceControlItem.locator('.MaskIconSourceControl')
  await waitFor(() => expect(sourceControlIcon).toBeVisible())
  await sourceControlIcon.click()
  await waitFor(() => expect(sourceControlItem).toHaveAttribute('aria-selected', 'false'))
}
