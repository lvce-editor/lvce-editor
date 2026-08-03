import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.search-editor-replace-all-accessibility'

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

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'needle')
  await Workspace.setPath(tmpDir)
  await Main.closeAllEditors()
  await Main.openUri('search-editor://1/Search')

  const input = Locator('.Main textarea[name="SearchValue"]')
  await waitFor(() => expect(input).toBeVisible())
  await input.type('needle')
  await waitFor(() => expect(Locator('.Main .Search .TreeItem')).toHaveCount(2))

  await Locator('.Main button[title="Toggle Replace"]').click()
  const replaceInput = Locator('.Main textarea[name="ReplaceValue"]')
  await waitFor(() => expect(replaceInput).toBeVisible())
  await replaceInput.type('pin')
  const replaceAll = Locator('.Main button[name="ReplaceAll"]')
  await expect(replaceAll).toHaveAttribute('role', null)
  await expect(replaceAll).toHaveAttribute('aria-checked', null)
}
