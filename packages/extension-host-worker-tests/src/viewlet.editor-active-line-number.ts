import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-active-line-number'

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

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  await Settings.update({ 'editor.lineNumbers': true })
  const tmpDir = await FileSystem.getTmpDir()
  const filePath = `${tmpDir}/active-line-number.txt`
  await FileSystem.writeFile(filePath, 'line 1\nline 2')
  await Workspace.setPath(tmpDir)
  await Main.openUri(filePath)

  const editorInput = Locator('[name="editor"]')
  const activeLineNumber = Locator('.LineNumberActive')
  await Command.execute('Main.focus')
  await waitFor(() => expect(editorInput).toBeFocused())
  await expect(activeLineNumber).toHaveText('1')
  await expect(activeLineNumber).toHaveCSS('color', 'rgba(155, 162, 160, 0.7)')

  await Editor.cursorDown()
  await expect(activeLineNumber).toHaveText('2')

  await Command.execute('QuickPick.showCommands')
  await waitFor(() => expect(Locator('#QuickPick .InputBox')).toBeFocused())
  await expect(activeLineNumber).toHaveText('2')
  await expect(activeLineNumber).toHaveCSS('color', 'rgba(155, 162, 160, 0.7)')
}
