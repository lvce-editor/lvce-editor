import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-breadcrumbs-typescript-symbol'

export const test: Test = async ({ Editor, FileSystem, Locator, Main, Settings, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/values.ts`
  await FileSystem.writeFile(uri, 'const value = 1')
  await Settings.update({
    'breadcrumbs.enabled': true,
  })
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Editor.setCursor(0, 8)

  const items = Locator('.EditorBreadcrumb')
  await expect(items).toHaveCount(2)
  await expect(items.nth(0)).toHaveText('values.ts')
  await expect(items.nth(1)).toHaveText('value')
  await expect(items.nth(1)).toHaveAttribute('data-kind', 'symbol')
}
