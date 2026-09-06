import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.component-state-live-dom'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a.txt`, 'first')
  await FileSystem.writeFile(`${tmpDir}/b.txt`, 'second')
  await Workspace.setPath(tmpDir)
  await Command.execute('Layout.showSideBar', 'Explorer')
  const firstItem = Locator('.Explorer .TreeItem[aria-label="a.txt"]')
  const secondItem = Locator('.Explorer .TreeItem[aria-label="b.txt"]')
  await expect(firstItem).toBeVisible()
  await expect(secondItem).toBeVisible()
  const components = await Command.execute('ComponentState.getComponents')
  const explorer = components.find((component) => component.moduleId === 'Explorer')
  const uri = `live-component-state:///dom/${explorer.uid}.json`
  await Main.openUri(uri)

  for (const focusedIndex of [1, 0, 1]) {
    const state = await Command.execute('ComponentState.getState', explorer.uid)
    await Command.execute('ComponentState.setState', explorer.uid, { ...state, focusedIndex })
    let refreshed = false
    for (let attempt = 0; attempt < 100; attempt++) {
      const document = await Command.execute('GetActiveEditor.getTextDocument')
      if (document?.text) {
        const dom = JSON.parse(document.text)
        const activeItem = dom.find((node) => node.id === 'TreeItemActive')
        if (activeItem?.ariaLabel === (focusedIndex === 0 ? 'a.txt' : 'b.txt')) {
          refreshed = true
          break
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 20))
    }
    if (!refreshed) {
      throw new Error('Live virtual DOM JSON did not refresh after the component rendered')
    }
  }

  const dom = await Command.execute('ComponentState.getDom', explorer.uid)
  const preview = [{ ...dom[0], childCount: 0, className: `${dom[0].className} EditedDom` }]
  await Command.execute('ComponentState.setDom', explorer.uid, preview)
  await expect(Locator('.Explorer.EditedDom')).toBeVisible()
  await expect(firstItem).toBeHidden()
  const previewFile = JSON.parse(await FileSystem.readFile(uri))
  if (JSON.stringify(previewFile) !== JSON.stringify(preview)) {
    throw new Error('The virtual DOM file must reflect the displayed preview')
  }
  const state = await Command.execute('ComponentState.getState', explorer.uid)
  await Command.execute('ComponentState.setState', explorer.uid, { ...state, focusedIndex: 0 })
  await expect(firstItem).toBeVisible()
  await expect(secondItem).toBeVisible()
  await expect(firstItem).toHaveId('TreeItemActive')
  await expect(Locator('.EditedDom')).toBeHidden()
}
