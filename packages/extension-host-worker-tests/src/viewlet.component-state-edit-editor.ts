import type { Test } from '@lvce-editor/test-with-playwright'

interface ComponentInfo {
  readonly editable: boolean
  readonly moduleId: string
  readonly uid: number
}

export const name = 'viewlet.component-state-edit-editor'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/editor-state.txt`
  await FileSystem.writeFile(uri, 'original text')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await expect(Locator('.Editor')).toContainText('original text')
  await Command.execute('Developer.openComponentState')
  const components = (await Command.execute('ComponentState.getComponents')) as readonly ComponentInfo[]
  const component = components.find((item) => item.moduleId === 'EditorText' || item.moduleId === 'Editor')
  if (!component?.editable) {
    throw new Error(`Expected an editable editor component, got ${JSON.stringify(components)}`)
  }

  await Main.splitRight()
  await Locator(`.ComponentStateCard[data-uid="${component.uid}"]`).click()
  await expect(Locator('.MainTabSelected .TabTitle').nth(1)).toHaveText(`${component.uid}.json`)
  await expect(Locator('.Editor').nth(1)).toContainText('{')
  const state = JSON.parse(await Editor.getText())
  if (state.uri !== uri || state.lines[0] !== 'original text' || !Array.isArray(state.selections)) {
    throw new Error('Expected JSON to contain editor-worker text and selection state')
  }
  const editedState = { ...state, lines: ['changed through JSON'], selections: [0, 0, 0, 0] }
  await Editor.setText(`${JSON.stringify(editedState, null, 2)}\n`)
  await Main.save()
  await expect(Locator('.Editor').nth(0)).toContainText('changed through JSON')

  const updated = await Command.execute('ComponentState.getState', component.uid)
  if (updated.lines[0] !== 'changed through JSON') {
    throw new Error('Expected edited JSON to update editor-worker state')
  }
  await Main.openUri(uri)
  await Editor.setCursor(0, 0)
  await Editor.type('!')
  await expect(Locator('.Editor').nth(0)).toContainText('!changed through JSON')
}
