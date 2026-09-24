import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.extensions-shortcut-focus'

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

export const test: Test = async ({ Command, expect, FileSystem, KeyBoard, Locator, Main, SideBar, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const fileUri = `${tmpDir}/file.txt`
  await FileSystem.writeFile(fileUri, '')
  await Workspace.setPath(tmpDir)
  await SideBar.open('Explorer')
  await Main.openUri(fileUri)

  const editorInput = Locator('[name="editor"]')
  const extensionsInput = Locator('.SideBar input[name="extensions"]')
  await expect(editorInput).toBeFocused()
  await KeyBoard.press('Control+Shift+X')
  await waitFor(() => expect(extensionsInput).toBeVisible())
  await waitFor(() => expect(extensionsInput).toBeFocused())
  await extensionsInput.type('atom')
  await expect(extensionsInput).toHaveValue('atom')

  await Command.execute('Main.focus')
  await expect(editorInput).toBeFocused()
  await KeyBoard.press('Control+Shift+X')
  await waitFor(() => expect(extensionsInput).toBeFocused())
  await expect(extensionsInput).toHaveValue('atom')
}
