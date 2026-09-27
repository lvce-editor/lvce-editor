import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.quick-pick-responsive-layout'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Main, Workspace }) => {
  const tmpDir = await FileSystem.getTmpDir()
  const file = `${tmpDir}/index.html`
  await FileSystem.writeFile(file, '<p>preview</p>')
  await Workspace.setPath(tmpDir)
  await Main.openUri(file)

  await Command.execute('QuickPick.showCommands')

  const quickPick = Locator('#QuickPick')
  await expect(quickPick).toBeVisible()
  await expect(quickPick).toHaveCSS('width', '600px')
  await expect(quickPick).toHaveCSS('transform', 'matrix(1, 0, 0, 1, -300, 0)')

  await Command.execute('Viewlet.closeWidget', 'QuickPick')
  await Command.execute('Layout.showPreview', file)
  await expect(Locator('.SimpleBrowser .Preview')).toBeVisible()
  await Command.execute('QuickPick.showCommands')
  await expect(quickPick).toBeVisible()
  await expect(quickPick).not.toHaveCSS('width', '600px')
}
