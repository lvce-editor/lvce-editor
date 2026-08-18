import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-minimap-toggle-and-scroll'

export const test: Test = async ({ Editor, FileSystem, Locator, Main, Settings, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/file.js`
  const content = Array.from({ length: 100 }, (_, index) => `const value${index} = ${index}`).join('\n')
  await FileSystem.writeFile(uri, content)
  await Settings.update({
    'editor.minimap.enabled': false,
  })
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)

  await expect(Locator('.EditorMinimap')).toHaveCount(0)

  await Settings.update({
    'editor.minimap.enabled': true,
  })
  const minimap = Locator('.EditorMinimap')
  await expect(minimap).toHaveAttribute('data-line-count', '100')
  await expect(Locator('.EditorMinimapCanvas')).toHaveCount(1)

  await Editor.setDeltaY(200)
  await expect(minimap).toHaveAttribute('data-visible-start', '10')

  await Settings.update({
    'editor.minimap.enabled': false,
  })
  await expect(Locator('.EditorMinimap')).toHaveCount(0)
  await expect(Locator('.EditorMinimapCanvas')).toHaveCount(0)
}
