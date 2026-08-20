import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-breadcrumbs-file-path'

export const test: Test = async ({ FileSystem, Locator, Main, Settings, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/src`)
  await FileSystem.mkdir(`${tmpDir}/src/components`)
  const uri = `${tmpDir}/src/components/readme.txt`
  await FileSystem.writeFile(uri, 'plain text')
  await Settings.update({
    'breadcrumbs.enabled': true,
  })
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)

  const items = Locator('.EditorBreadcrumb')
  await expect(items).toHaveCount(3)
  await expect(items.nth(0)).toHaveText('src')
  await expect(items.nth(1)).toHaveText('components')
  await expect(items.nth(2)).toHaveText('readme.txt')
  await expect(Locator('.EditorBreadcrumbSymbol')).toHaveCount(0)
}
