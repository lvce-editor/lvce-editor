import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.search-editor-context-lines'

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

const setValue = async (input: any, value: string): Promise<void> => {
  await input.click()
  await input.press('Control+A')
  await input.type(value)
}

export const test: Test = async ({ expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'before two\nbefore one\nneedle\nafter one\nafter two\nlast line')
  await Workspace.setPath(tmpDir)
  await Main.closeAllEditors()
  await Main.openUri('search-editor://1/Search')

  const contextLinesInput = Locator('#Main input[name="ContextLines"]')
  const toggleContextLines = Locator('#Main button[name="ToggleContextLines"]')
  await waitFor(() => expect(contextLinesInput).toBeVisible())
  await waitFor(() => expect(contextLinesInput).toHaveValue('1'))
  await waitFor(() => expect(toggleContextLines).toBeVisible())
  await waitFor(() => expect(toggleContextLines).toHaveAttribute('aria-checked', 'false'))

  const input = Locator('#Main textarea[name="SearchValue"]')
  await input.type('needle')
  const results = Locator('.Main .Search .TreeItem')
  await waitFor(() => expect(results).toHaveCount(2))

  await toggleContextLines.click()
  await expect(toggleContextLines).toHaveAttribute('aria-checked', 'true')
  await waitFor(() => expect(results).toHaveCount(4))

  await setValue(contextLinesInput, '2')
  await waitFor(() => expect(results).toHaveCount(6))
  const labels = Locator('.Main .Search .TreeItem .Label')
  await expect(labels.nth(1)).toHaveText('before two')
  await expect(labels.nth(2)).toHaveText('before one')
  await expect(labels.nth(3)).toHaveText('needle')
  await expect(labels.nth(4)).toHaveText('after one')
  await expect(labels.nth(5)).toHaveText('after two')

  await toggleContextLines.click()
  await waitFor(() => expect(results).toHaveCount(2))
}
