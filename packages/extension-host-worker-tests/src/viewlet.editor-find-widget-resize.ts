import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-find-widget-resize'

export const test: Test = async ({ Command, Editor, FileSystem, Locator, Main, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/file1.txt`
  await FileSystem.writeFile(file, 'content 1\ncontent 2')
  await Workspace.setPath(tmpDir)
  await Main.openUri(file)
  await Command.execute('Layout.handleResize', 1280, 720)

  await Editor.openFindWidget()

  const findWidget = Locator('.FindWidget')

  await Command.execute('Layout.handleSashPointerDown', 'SideBar')
  await Command.execute('Layout.handleSashPointerMove', 500, 300)

  await expect(findWidget).toHaveCSS('left', '180px')
  await expect(findWidget).toHaveCSS('width', '300px')
}
