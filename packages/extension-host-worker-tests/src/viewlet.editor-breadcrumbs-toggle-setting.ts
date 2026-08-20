import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-breadcrumbs-toggle-setting'

export const test: Test = async ({ FileSystem, Locator, Main, Settings, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/file.ts`
  await FileSystem.writeFile(uri, 'const value = 1')
  await Settings.update({
    'breadcrumbs.enabled': false,
  })
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)

  const breadcrumbs = Locator('.EditorBreadcrumbs')
  await expect(breadcrumbs).toHaveCount(0)

  await Settings.update({
    'breadcrumbs.enabled': true,
  })
  await expect(breadcrumbs).toHaveCount(1)
  await expect(Locator('.EditorBreadcrumb')).toHaveCount(2)

  await Settings.update({
    'breadcrumbs.enabled': false,
  })
  await expect(breadcrumbs).toHaveCount(0)
}
