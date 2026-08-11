import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-large-line-numbers'

export const test: Test = async ({ Editor, FileSystem, Locator, Main, Settings, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/large.txt`
  const content = Array.from({ length: 4472 }, (_, index) => `line ${index + 1}`).join('\n')
  await FileSystem.writeFile(uri, content)
  await Settings.update({
    'editor.lineNumbers': true,
  })
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)

  await Editor.setDeltaY(80_000)

  await expect(Locator('.Gutter')).toHaveCSS('width', /^(3[1-9]|[4-9]\d|\d{3,})(?:\.\d+)?px$/ as unknown as string)
}
