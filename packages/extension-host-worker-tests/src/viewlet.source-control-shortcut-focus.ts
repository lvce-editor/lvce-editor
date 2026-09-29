import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.source-control-shortcut-focus'

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

export const test: Test = async ({ ActivityBar, Command, expect, Extension, FileSystem, KeyBoard, Locator, Main, SideBar, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const fileUri = `${tmpDir}/file.txt`
  await FileSystem.writeFile(fileUri, '')
  await Workspace.setPath(tmpDir)
  const extensionUri = new URL('../fixtures/sample.source-control-save-badge', import.meta.url).toString().replace(/\/$/, '')
  await Extension.addWebExtension(extensionUri)
  await Extension.enableWorkspace('sample.source-control-save-badge')
  await ActivityBar.handleExtensionsChanged()
  const activationResult = await Command.execute('ExtensionManagement.activateByEvent', 'onSourceControl:memfs', '', 0)
  if (activationResult.error) {
    throw activationResult.error
  }
  await Command.execute('Layout.handleExtensionsChanged')
  await SideBar.open('Explorer')
  await Main.openUri(fileUri)

  const editorInput = Locator('[name="editor"]')
  const sourceControlInput = Locator('.SideBar textarea[name="SourceControlInput"]')
  await expect(editorInput).toBeFocused()
  await KeyBoard.press('Control+Shift+G')
  await waitFor(() => expect(sourceControlInput).toBeVisible())
  await waitFor(() => expect(sourceControlInput).toBeFocused())
  await sourceControlInput.type('commit message')
  await expect(sourceControlInput).toHaveValue('commit message')

  await Command.execute('Main.focus')
  await expect(editorInput).toBeFocused()
  await KeyBoard.press('Control+Shift+G')
  await waitFor(() => expect(sourceControlInput).toBeFocused())
  await expect(sourceControlInput).toHaveValue('commit message')
}
