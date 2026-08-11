import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-split-down-line-numbers'

export const test: Test = async ({ FileSystem, Locator, Main, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/file.txt`
  const content = Array.from({ length: 100 }, (_, index) => `line ${index + 1}`).join('\n')
  await FileSystem.writeFile(uri, content)
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)

  await Main.splitDown()
  await Main.openUri(uri)

  const editors = Locator('.Editor')
  await expect(editors).toHaveCount(2)
  await expect(editors.nth(0).locator('.LineNumber').first()).toHaveCSS('flex-shrink', '0')
  await expect(editors.nth(1).locator('.LineNumber').first()).toHaveCSS('flex-shrink', '0')
}
