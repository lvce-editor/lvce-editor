import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.source-control-progress'

export const test: Test = async ({ ActivityBar, Command, expect, Extension, FileSystem, Locator, SourceControl, Workspace }) => {
  await Workspace.setPath(await FileSystem.getTmpDir())
  const extensionUri = new URL('../fixtures/sample.source-control-progress', import.meta.url).toString().replace(/\/$/, '')
  await Extension.addWebExtension(extensionUri)
  await Extension.enableWorkspace('sample.source-control-progress')
  await ActivityBar.handleExtensionsChanged()
  await Command.execute('ExtensionManagement.activateByEvent', 'onSourceControl:memfs', '', 0)
  await Command.execute('Layout.handleExtensionsChanged')
  await SourceControl.show()

  const progress = Locator('.Viewlet.SourceControl > .ProgressContainer')
  const bar = progress.locator('.Progress')
  const input = Locator('.Viewlet.SourceControl textarea')
  await expect(progress).toBeVisible()
  await expect(input).toBeVisible()
  await expect(bar).toHaveCSS('animation-name', 'progress')
  await expect(bar).toHaveCSS('animation-duration', '4s')
  await Command.execute('ExtensionHost.executeCommand', 'sourceControlProgress.finish')
  await expect(progress).toHaveCount(0)
  await Command.execute('ExtensionHost.executeCommand', 'sourceControlProgress.begin')
  await expect(progress).toBeVisible()
  await Command.execute('ExtensionHost.executeCommand', 'sourceControlProgress.finish')
  await expect(progress).toHaveCount(0)
}
