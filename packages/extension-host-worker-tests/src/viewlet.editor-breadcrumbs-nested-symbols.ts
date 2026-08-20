import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-breadcrumbs-nested-symbols'

export const test: Test = async ({ Editor, FileSystem, Locator, Main, Settings, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/App.ts`
  await FileSystem.writeFile(
    uri,
    `class App {
  render() {
    return 1
  }
}`,
  )
  await Settings.update({
    'breadcrumbs.enabled': true,
  })
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Editor.setCursor(2, 6)

  const symbols = Locator('.EditorBreadcrumbSymbol')
  await expect(symbols).toHaveCount(2)
  await expect(symbols.nth(0)).toHaveText('App')
  await expect(symbols.nth(1)).toHaveText('render')
}
