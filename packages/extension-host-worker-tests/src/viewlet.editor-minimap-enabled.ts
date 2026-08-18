import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-minimap-enabled'

export const test: Test = async ({ FileSystem, Locator, Main, Settings, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/file.js`
  const content = ['const value = 1', 'function add(a, b) {', '  return a + b', '}', 'add(value, 2)'].join('\n')
  await FileSystem.writeFile(uri, content)
  await Settings.update({
    'editor.minimap.enabled': true,
  })
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)

  const minimap = Locator('.EditorMinimap')
  await expect(minimap).toHaveCount(1)
  await expect(minimap).toHaveCSS('width', '120px')
  await expect(minimap).toHaveAttribute('data-line-count', '5')
  await expect(Locator('.EditorMinimapCanvas')).toHaveCount(1)

  await Settings.update({
    'editor.minimap.enabled': false,
  })
}
