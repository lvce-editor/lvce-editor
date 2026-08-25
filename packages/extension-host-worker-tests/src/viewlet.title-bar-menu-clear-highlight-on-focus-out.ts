import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.title-bar-menu-clear-highlight-on-focus-out'

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

export const test: Test = async ({ expect, FileSystem, Locator, Main, TitleBarMenuBar, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/test.txt`
  await FileSystem.writeFile(file, 'test')
  await Workspace.setPath(tmpDir)
  await Main.openUri(file)

  const titleBarMenuBar = Locator('.TitleBarMenuBar')
  const helpMenuItem = Locator('.TitleBarTopLevelEntry', { hasText: 'Help' })
  const menu = Locator('.Menu')
  const editorRow = Locator('.EditorRow').first()
  const editorInput = Locator('[name="editor"]')

  await helpMenuItem.click()
  await waitFor(() => expect(menu).toBeVisible())

  await TitleBarMenuBar.handleKeyEscape()
  await waitFor(() => expect(menu).toBeHidden())
  await expect(helpMenuItem).toHaveAttribute('id', 'TitleBarEntryActive')
  // The test locator's synthetic mouse click omits the browser's default button focus behavior.
  await helpMenuItem.type('')
  await waitFor(() => expect(helpMenuItem).toBeFocused())

  await new Promise((resolve) => setTimeout(resolve, 200))
  await editorRow.click()
  await waitFor(() => expect(editorInput).toBeFocused())
  await waitFor(() => expect(helpMenuItem).toHaveAttribute('id', null))
  await waitFor(() => expect(helpMenuItem).toHaveAttribute('aria-expanded', 'false'))
  await waitFor(() => expect(titleBarMenuBar).toHaveAttribute('aria-activedescendant', null))
}
