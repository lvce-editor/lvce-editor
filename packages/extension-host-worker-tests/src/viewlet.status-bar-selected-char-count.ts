import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.status-bar-selected-char-count'

export const test: Test = async ({ Editor, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/status-bar.txt`
  await FileSystem.writeFile(uri, 'first\nsecond line')
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)

  const position = Locator('.StatusBarItem[name="EditorPosition"]')
  await expect(position).toHaveText('Ln 1, Col 1')

  await Editor.setSelections(new Uint32Array([1, 0, 1, 6]))
  await expect(position).toHaveText('Ln 2, Col 7 (6 selected)')
  await Editor.setSelections(new Uint32Array([1, 1, 1, 6]))
  await expect(position).toHaveText('Ln 2, Col 7 (5 selected)')
  await Editor.setSelections(new Uint32Array([1, 6, 1, 6]))
  await expect(position).toHaveText('Ln 2, Col 7')

  await Main.closeAllEditors()
  await expect(position).toHaveCount(0)
}
