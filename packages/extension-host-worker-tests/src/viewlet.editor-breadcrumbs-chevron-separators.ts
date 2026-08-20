import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-breadcrumbs-chevron-separators'

export const test: Test = async ({ Editor, FileSystem, Locator, Main, Settings, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/src`)
  const uri = `${tmpDir}/src/App.ts`
  await FileSystem.writeFile(
    uri,
    `class App {
  render() {}
}`,
  )
  await Settings.update({
    'breadcrumbs.enabled': true,
  })
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Editor.setCursor(1, 4)

  await expect(Locator('.EditorBreadcrumb')).toHaveCount(4)
  const separators = Locator('.EditorBreadcrumbSeparator')
  await expect(separators).toHaveCount(3)
  await expect(separators.nth(0)).toHaveClass('EditorBreadcrumbSeparator MaskIcon MaskIconChevronRight')
  await expect(separators.nth(1)).toHaveClass('EditorBreadcrumbSeparator MaskIcon MaskIconChevronRight')
  await expect(separators.nth(2)).toHaveClass('EditorBreadcrumbSeparator MaskIcon MaskIconChevronRight')
}
