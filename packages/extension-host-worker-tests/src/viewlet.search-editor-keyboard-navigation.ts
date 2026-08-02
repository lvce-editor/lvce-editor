import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.search-editor-keyboard-navigation'

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

export const test: Test = async ({ FileSystem, KeyBoard, Locator, Main, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'needle')
  await Workspace.setPath(tmpDir)
  await Main.closeAllEditors()
  await Main.openUri('search-editor://1/Search')

  const input = Locator('.Main textarea[name="SearchValue"]')
  await waitFor(() => expect(input).toBeVisible())
  await input.click()
  await input.type('needle')
  await waitFor(() => expect(Locator('.Main .Search .TreeItem')).toHaveCount(2))

  const results = Locator('.Main .Search [role="tree"]')
  await results.dispatchEvent('focus', { bubbles: false } as unknown as string)
  await new Promise((resolve) => setTimeout(resolve, 100))
  await KeyBoard.press('ArrowDown')

  await waitFor(() => expect(input).toHaveValue('needle'))
  await waitFor(() => expect(Locator('.Main .Search .TreeItemActive')).toHaveCount(1))
}
