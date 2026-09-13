import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'extension.notebook-disabled-by-default'

export const test: Test = async ({ Command, expect, ExtensionDetail, FileSystem, Locator, Main, QuickPick, RunningExtensions }) => {
  const extensionId = 'builtin.notebook'
  await ExtensionDetail.open(extensionId)
  await expect(Locator('.ExtensionDetailName')).toHaveText('Notebookbuiltin')
  await expect(Locator('[name="Enable"]')).toBeVisible()
  await expect(Locator('[name="Install"]')).toBeHidden()
  await expect(Locator('[name="Disable"]')).toBeHidden()

  await QuickPick.open()
  await QuickPick.setValue('>Notebook: Show')
  await expect(Locator('.QuickPickItem', { hasText: 'Notebook: Show' })).toBeHidden()
  await Command.execute('Viewlet.closeWidget', 'QuickPick')
  await RunningExtensions.show()
  await expect(Locator('.RunningExtensionId', { hasText: extensionId })).toBeHidden()

  const tmpDir = await FileSystem.getTmpDir()
  const uri = `${tmpDir}/bundled-notebook.ipynb`
  await FileSystem.writeFile(
    uri,
    JSON.stringify({
      nbformat: 4,
      nbformat_minor: 5,
      cells: [{ cell_type: 'code', source: ['print(42)'], metadata: {}, execution_count: null, outputs: [] }],
      metadata: {},
    }),
  )
  await Main.openUri(uri)
  await expect(Locator('.NotebookSource')).toBeHidden()
  await Main.closeAllEditors()

  await ExtensionDetail.open(extensionId)
  await ExtensionDetail.handleClickEnable()
  try {
    await expect(Locator('[name="Disable"]')).toBeVisible()
    await Main.openUri(uri)
    await expect(Locator('.NotebookSource')).toHaveValue('print(42)')
    await expect(Locator('.NotebookTitle')).toHaveText('Notebook')
  } finally {
    await Main.closeAllEditors()
    await ExtensionDetail.open(extensionId)
    await ExtensionDetail.handleClickDisable()
  }
}
