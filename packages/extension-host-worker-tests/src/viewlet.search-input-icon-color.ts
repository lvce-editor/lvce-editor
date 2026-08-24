import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.search-input-icon-color'

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

export const test: Test = async ({ expect, Locator, Main }) => {
  await Main.closeAllEditors()
  await Main.openUri('search-editor://1/Search')
  await Locator('.Main button[title="Toggle Replace"]').click()

  const inputIcons = Locator('.Main .SearchField .SearchFieldButton .MaskIcon')
  await waitFor(() => expect(inputIcons).toHaveCount(4))

  for (let index = 0; index < 4; index++) {
    await expect(inputIcons.nth(index)).toHaveCSS('color', 'rgb(188, 190, 190)')
  }
}
