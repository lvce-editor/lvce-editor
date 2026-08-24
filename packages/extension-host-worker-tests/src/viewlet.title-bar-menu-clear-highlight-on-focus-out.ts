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
  const fileMenuItem = Locator('.TitleBarTopLevelEntry', { hasText: 'File' })
  const editorInput = Locator('[name="editor"]')

  await TitleBarMenuBar.focus()
  await TitleBarMenuBar.handleKeyArrowDown()
  await expect(Locator('.Menu')).toBeVisible()

  await TitleBarMenuBar.handleKeyEscape()
  await expect(fileMenuItem).toHaveAttribute('id', 'TitleBarEntryActive')

  await editorInput.click()
  await titleBarMenuBar.dispatchEvent('focusout', { bubbles: true } as unknown as string)
  await waitFor(() => expect(fileMenuItem).toHaveAttribute('id', null))
  await waitFor(() => expect(titleBarMenuBar).toHaveAttribute('aria-activedescendant', null))
}
