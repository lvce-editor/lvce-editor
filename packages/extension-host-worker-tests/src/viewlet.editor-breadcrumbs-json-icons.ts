import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-breadcrumbs-json-icons'

export const test: Test = async ({ Editor, FileSystem, Locator, Main, Settings, Workspace, expect }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/package.json`
  await FileSystem.writeFile(uri, '{\n  "scripts": {\n    "build": "tsc"\n  },\n  "items": [\n    {"enabled": true, "count": 42, "empty": null}\n  ]\n}')
  await Settings.update({ 'breadcrumbs.enabled': true, 'workbench.iconTheme': 'vscode-icons' })
  await Workspace.setPath(tmpDir)
  await Main.openUri(uri)
  await Editor.setCursor(2, 15)
  const symbols = Locator('.EditorBreadcrumbSymbol')
  await expect(symbols).toHaveCount(2)
  await expect(symbols.nth(0)).toHaveText('scripts')
  await expect(symbols.nth(1)).toHaveText('build')
  await expect(Locator('.EditorBreadcrumbFile .FileIcon')).toHaveAttribute('src', /file_type_npm/)
  await expect(Locator('.MaskIconSymbolObject')).toHaveCSS('mask-image', /\/json.svg/)
  await expect(Locator('.MaskIconSymbolString')).toHaveCSS('mask-image', /\/symbol-string.svg/)
  await Editor.setCursor(5, 18)
  await expect(symbols).toHaveCount(3)
  await expect(symbols.nth(0)).toHaveText('items')
  await expect(symbols.nth(1)).toHaveText('0')
  await expect(symbols.nth(2)).toHaveText('enabled')
  await expect(Locator('.MaskIconSymbolArray')).toHaveCSS('mask-image', /\/symbol-array.svg/)
  await expect(Locator('.MaskIconSymbolBoolean')).toHaveCSS('mask-image', /\/symbol-boolean.svg/)
  await Editor.setCursor(5, 31)
  await expect(symbols.nth(2)).toHaveText('count')
  await expect(Locator('.MaskIconSymbolNumber')).toHaveCSS('mask-image', /\/symbol-numeric.svg/)
  await Editor.setCursor(5, 46)
  await expect(symbols.nth(2)).toHaveText('empty')
  await expect(Locator('.MaskIconSymbolNull')).toHaveCSS('mask-image', /\/circle-slash.svg/)
  await Editor.setCursor(0, 0)
  await Editor.type('\n')
  await Editor.setCursor(6, 18)
  await expect(symbols).toHaveCount(3)
  await expect(symbols.nth(2)).toHaveText('enabled')
}
