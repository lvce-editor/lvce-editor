import type { Test } from '@lvce-editor/test-with-playwright'

interface ComponentInfo {
  readonly editable: boolean
  readonly moduleId: string
  readonly uid: number
}

export const name = 'viewlet.component-state-edit-explorer'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'content')
  await Workspace.setPath(tmpDir)
  await expect(Locator('.Explorer')).toBeVisible()

  await Command.execute('Developer.openComponentState')
  await expect(Locator('.ComponentStateView')).toBeVisible()

  const components = (await Command.execute('ComponentState.getComponents')) as readonly ComponentInfo[]
  const explorer = components.find((component) => component.moduleId === 'Explorer')
  if (!explorer || !explorer.editable) {
    throw new Error(`Expected an editable Explorer component, got ${JSON.stringify(components)}`)
  }

  const card = Locator(`.ComponentStateCard[data-uid="${explorer.uid}"]`)
  await expect(card).toBeVisible()
  await card.click()

  await expect(Locator('.MainTabSelected .TabTitle')).toHaveText(`${explorer.uid}.json`)
  const state = JSON.parse(await Editor.getText())
  await Editor.setText(`${JSON.stringify({ ...state, focusedIndex: 0 }, null, 2)}\n`)
  await Main.save()

  const updatedState = await Command.execute('ComponentState.getState', explorer.uid)
  if (updatedState.focusedIndex !== 0) {
    throw new Error(`Expected Explorer focusedIndex to be 0, got ${updatedState.focusedIndex}`)
  }
  await expect(Locator('.Explorer .TreeItem').first()).toHaveId('TreeItemActive')
}
