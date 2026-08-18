import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-minimap-disabled'

export const test: Test = async ({ FileSystem, Locator, Main, Settings, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/file.js`
  await FileSystem.writeFile(uri, 'const value = 1')
  await Settings.update({
    'editor.minimap.enabled': false,
  })
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)

  await expect(Locator('.EditorMinimap')).toHaveCount(0)
  await expect(Locator('.EditorMinimapCanvas')).toHaveCount(0)
}
