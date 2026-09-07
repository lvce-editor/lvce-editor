import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.ports-codespaces'

export const test: Test = async ({ Command, expect, Extension, Locator, Workspace }) => {
  await Workspace.openTmpDir()
  const extensionUri = new URL('../fixtures/sample.codespaces-ports', import.meta.url).href
  await Extension.addWebExtension(extensionUri)
  await Extension.enableWorkspace('sample.codespaces-ports')
  await Command.execute('Workspace.setUri', 'codespaces://test-space/workspaces/app')
  await Command.execute('Layout.showPanel', 'Ports')
  const address = Locator('.Ports a')
  await expect(address).toHaveText('https://test-space-3000.app.github.dev/')
  await expect(Locator('.Ports')).toContainText('3000')
  await expect(Locator('.Ports')).toContainText('devcontainer.json')
  await Command.execute('Workspace.setUri', 'memfs:///')
  await expect(address).toHaveCount(0)
  await expect(Locator('.Ports')).toContainText('No forwarded ports')
}
