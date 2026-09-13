import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-area-split-hide-explorer'

export const test: Test = async ({ Command, DragAndDrop, expect, FileSystem, Locator, Main, Workspace }) => {
  await Command.execute('Layout.setExplicitBounds', 880, 1042)
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/eslint.config.js`
  await FileSystem.writeFile(uri, 'export default []')
  await Workspace.setPath(tmpDir)
  await Command.execute('Layout.moveSideBarRight')
  await Command.execute('Layout.showSideBar')
  await Command.execute('Layout.handleSashSideBarPointerDown')
  await Command.execute('Layout.handleSashPointerMove', 432, 300)
  await Command.execute('Layout.handleSashPointerUp', '')
  await Main.openUri(uri)
  await Main.splitRight()
  const dropId = await DragAndDrop.createDropSession([{ kind: 'string', type: 'text/uri-list', value: uri }])
  await Command.execute('Main.handleDragOver', 324, 500)
  await Command.execute('Main.handleDrop', dropId)
  const sash = Locator('.Main .SashVertical')
  await expect(sash).toHaveCSS('left', '250px')
  await Command.execute('Layout.hideSideBar')
  await expect(Locator('.EditorGroup')).toHaveCount(2)
  await expect(sash).toHaveCSS('left', '416px')
  await expect(Locator('.EditorGroup').first()).toHaveCSS('width', '416px')

  await Command.execute('Layout.showSideBar')
  await expect(sash).toHaveCSS('left', '250px')
  await Command.execute('Layout.hideSideBar')
  await expect(sash).toHaveCSS('left', '416px')

  await Command.execute('Layout.setExplicitBounds', 1080, 1042)
  await expect(sash).toHaveCSS('left', '516px')
  await expect(Locator('.EditorGroup').first()).toHaveCSS('width', '516px')
}
