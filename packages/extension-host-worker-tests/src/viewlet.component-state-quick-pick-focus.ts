import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.component-state-quick-pick-focus'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, QuickPick, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a.txt`, 'first')
  await FileSystem.writeFile(`${tmpDir}/b.txt`, 'second')
  await Workspace.setPath(tmpDir)
  await Command.execute('Layout.showSideBar', 'Explorer')
  await Command.execute('Developer.openComponentState')
  const components = await Command.execute('ComponentState.getComponents')
  const explorer = components.find((component) => component.moduleId === 'Explorer')
  if (!explorer) {
    throw new Error('Expected a live Explorer component')
  }
  const uri = `live-component-state:///${explorer.uid}.json`
  await Main.openUri(uri)
  await expect(Locator('.Editor')).toContainText('$schema')
  await Command.execute('QuickPick.showCommands')
  const input = Locator('#QuickPick .InputBox')
  await expect(input).toBeFocused()

  for (const focusedIndex of [1, 0, 1]) {
    const state = await Command.execute('ComponentState.getState', explorer.uid)
    await FileSystem.writeFile(uri, JSON.stringify({ ...state, focused: true, focusedIndex }))
    let updated = false
    for (let attempt = 0; attempt < 100; attempt++) {
      const document = await Command.execute('GetActiveEditor.getTextDocument')
      if (document?.text && JSON.parse(document.text).focusedIndex === focusedIndex) {
        updated = true
        break
      }
      await new Promise((resolve) => setTimeout(resolve, 20))
    }
    if (!updated) {
      const actual = await Command.execute('ComponentState.getState', explorer.uid)
      const document = await Command.execute('GetActiveEditor.getTextDocument')
      const editorIndex = document?.text ? JSON.parse(document.text).focusedIndex : undefined
      throw new Error(`Live state editor did not refresh: expected ${focusedIndex}, component ${actual.focusedIndex}, editor ${editorIndex}`)
    }
    await expect(input).toBeFocused()
  }
  // Let delayed editor notifications and autosave finish as well.
  await new Promise((resolve) => setTimeout(resolve, 1500))
  await expect(input).toBeFocused()
  await QuickPick.setValue('>Developer')
  await expect(input).toHaveValue('>Developer')
  await expect(input).toBeFocused()
}
