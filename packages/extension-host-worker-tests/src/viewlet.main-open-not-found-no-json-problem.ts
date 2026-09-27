import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.main-open-not-found-no-json-problem'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Settings, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  await Settings.update({ 'editor.diagnostics': true })
  await Workspace.setPath(tmpDir)
  await Command.execute('Layout.showPanel', 'Problems')

  await Main.openUri(`live-component-state:///${Number.MAX_SAFE_INTEGER}.json`)
  await expect(Locator('.TextEditorErrorMessage')).toHaveText(`Component not found: ${Number.MAX_SAFE_INTEGER}`)
  await Command.execute('Editor.updateDiagnosticsAll')
  await expect(Locator('.ProblemsTableRow')).toHaveCount(0)

  const missingUri = `${tmpDir}/not-found.json`
  await Main.openUri(missingUri)
  await expect(Locator('.TextEditorErrorMessage')).toBeVisible()
  await Command.execute('Editor.updateDiagnosticsAll')
  await expect(Locator('.ProblemsTableRow')).toHaveCount(0)

  await Main.closeAllEditors()
}
