import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.quick-pick-hides-disabled-extension-commands'

const commandLabel = 'Quick Pick Disabled Command: Test'
const extensionId = 'sample.quick-pick-disabled-command'

export const test: Test = async ({ Command, expect, Extension, ExtensionDetail, Locator, QuickPick }) => {
  const extensionUri = new URL('../fixtures/sample.quick-pick-disabled-command', import.meta.url).toString()
  await Extension.addWebExtension(extensionUri)
  await QuickPick.open()
  await QuickPick.setValue(`>${commandLabel}`)

  const command = Locator('.QuickPickItem', { hasText: commandLabel })
  await expect(command).toBeVisible()

  await Command.execute('Viewlet.closeWidget', 'QuickPick')
  await ExtensionDetail.open(extensionId)
  await ExtensionDetail.handleClickDisable()
  await QuickPick.open()
  await QuickPick.setValue(`>${commandLabel}`)

  await expect(command).toBeHidden()

  await Command.execute('Viewlet.closeWidget', 'QuickPick')
  await ExtensionDetail.handleClickEnable()
}
