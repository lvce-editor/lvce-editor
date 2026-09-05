import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.component-state-refresh-scroll'

const waitForState = async (Command, focusedIndex: number): Promise<void> => {
  for (let attempt = 0; attempt < 100; attempt++) {
    const document = await Command.execute('GetActiveEditor.getTextDocument')
    if (document?.text && JSON.parse(document.text).focusedIndex === focusedIndex) {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, 20))
  }
  throw new Error(`Live component state did not update to focusedIndex ${focusedIndex}`)
}

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'content')
  await Settings.update({ 'editor.fontFamily': 'monospace', 'editor.lineNumbers': true })
  await Workspace.setPath(tmpDir)
  await Command.execute('Layout.showSideBar', 'Explorer')
  await expect(Locator('.Explorer')).toBeVisible()
  const components = await Command.execute('ComponentState.getComponents')
  const explorer = components.find((component) => component.moduleId === 'Explorer')
  await Main.openUri(`live-component-state:///${explorer.uid}.json`)
  await expect(Locator('.Editor .LineNumber').first()).toBeVisible()
  const selections = [2, 1, 2, 3]
  await Command.execute('GetActiveEditor.setSelections', selections)
  await Editor.setDeltaY(120)
  const firstLine = Locator('.Editor .LineNumber').first()
  await expect(firstLine).toHaveText('7')
  for (const focusedIndex of [1, 0, 1]) {
    const state = await Command.execute('ComponentState.getState', explorer.uid)
    await Command.execute('ComponentState.setState', explorer.uid, { ...state, focusedIndex })
    await waitForState(Command, focusedIndex)
    await expect(firstLine).toHaveText('7')
    const actualSelections = await Command.execute('GetActiveEditor.getSelections')
    if (JSON.stringify(actualSelections) !== JSON.stringify(selections)) {
      throw new Error(`Component state refresh changed the selection: ${JSON.stringify(actualSelections)}`)
    }
  }
}
