import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.editor-breadcrumbs-json-icons'

export const test: Test = async ({ Editor, FileSystem, KeyBoard, Locator, Main, Settings, Workspace, expect }) => {
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
  await expect(Locator('.EditorBreadcrumbFile .FileIcon[src*="file_type_npm.svg"]')).toHaveCount(1)
  await expect(Locator('.MaskIconSymbolObject')).toHaveCount(1)
  await expect(Locator('.MaskIconSymbolString')).toHaveCount(1)
  await Editor.setCursor(5, 18)
  await expect(symbols).toHaveCount(3)
  await expect(symbols.nth(0)).toHaveText('items')
  await expect(symbols.nth(1)).toHaveText('0')
  await expect(symbols.nth(2)).toHaveText('enabled')
  await expect(Locator('.MaskIconSymbolArray')).toHaveCount(1)
  await expect(Locator('.MaskIconSymbolBoolean')).toHaveCount(1)
  await Editor.setCursor(5, 31)
  await expect(symbols.nth(2)).toHaveText('count')
  await expect(Locator('.MaskIconSymbolNumber')).toHaveCount(1)
  await Editor.setCursor(5, 46)
  await expect(symbols.nth(2)).toHaveText('empty')
  await expect(Locator('.MaskIconSymbolNull')).toHaveCount(1)
  await Editor.setCursor(0, 0)
  await KeyBoard.press('Enter')
  await expect(Locator('.EditorRow')).toHaveCount(9)
  await Editor.setCursor(6, 18)
  await expect(symbols).toHaveCount(3)
  await expect(symbols.nth(2)).toHaveText('enabled')
}
