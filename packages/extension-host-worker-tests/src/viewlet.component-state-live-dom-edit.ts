import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.component-state-live-dom-edit'

export const test: Test = async ({ Command, Editor, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a.txt`, 'first')
  await FileSystem.writeFile(`${tmpDir}/b.txt`, 'second')
  await Settings.update({ 'editor.fontFamily': 'monospace' })
  await Workspace.setPath(tmpDir)
  await Command.execute('Layout.showSideBar', 'Explorer')
  const firstItem = Locator('.Explorer .TreeItem[aria-label="a.txt"]')
  await expect(firstItem).toBeVisible()
  const components = await Command.execute('ComponentState.getComponents')
  const explorer = components.find((component) => component.moduleId === 'Explorer')
  const uri = `live-component-state:///dom/${explorer.uid}.json`
  if (await Command.execute('FileSystem.isReadonly', uri)) {
    throw new Error('Live component DOM JSON must be editable')
  }
  await Main.openUri(uri)
  const dom = JSON.parse(await Editor.getText())
  const editedDom = [{ ...dom[0], childCount: 0, className: `${dom[0].className} LiveEditedDom` }]
  await Editor.setText(`${JSON.stringify(editedDom, null, 2)}\n`)
  await expect(Locator('.Explorer.LiveEditedDom')).toBeVisible()
  await expect(firstItem).toBeHidden()
  await expect(Locator('[name="editor"]')).toBeFocused()

  await Editor.setText('[')
  await expect(Locator('.Explorer.LiveEditedDom')).toBeVisible()
  await Editor.setText(`${JSON.stringify(editedDom, null, 2)}\n`)
  await Main.save()
  await expect(Locator('.Explorer.LiveEditedDom')).toBeVisible()

  const state = await Command.execute('ComponentState.getState', explorer.uid)
  await Command.execute('ComponentState.setState', explorer.uid, { ...state, focusedIndex: state.focusedIndex === 0 ? 1 : 0 })
  await expect(firstItem).toBeVisible()
  await expect(Locator('.LiveEditedDom')).toBeHidden()
}
