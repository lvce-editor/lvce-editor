import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.quick-pick-escape-restores-editor-focus'

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

export const test: Test = async ({ Command, expect, FileSystem, KeyBoard, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const fileUri = `${tmpDir}/file.txt`
  await FileSystem.writeFile(fileUri, '')
  await Workspace.setPath(tmpDir)
  await Main.openUri(fileUri)

  await Command.execute('QuickPick.showCommands')

  const quickPick = Locator('#QuickPick')
  await expect(quickPick).toBeVisible()
  const quickPickInput = Locator('#QuickPick .InputBox')
  await expect(quickPickInput).toBeFocused()
  await KeyBoard.press('Escape')
  await waitFor(() => expect(quickPick).toBeHidden())

  const editorInput = Locator('[name="editor"]')
  await waitFor(() => expect(editorInput).toBeFocused())
}
