import type { Test } from '@lvce-editor/test-with-playwright'
import { addLifecycleExtension, extensionId, runningExtensionSelector } from '../fixtures/sample.extension-disable-lifecycle/test.js'

export const name = 'extension-search.disable-removes-running-extension'

export const test: Test = async ({ expect, ExtensionSearch, Locator, RunningExtensions, ...api }) => {
  await addLifecycleExtension(api)
  await RunningExtensions.show()
  const runningExtensionsView = Locator('.RunningExtensions')
  const runningExtension = Locator(runningExtensionSelector, { hasText: extensionId })
  await expect(runningExtensionsView).toBeVisible()
  await expect(runningExtension).toBeVisible()

  await ExtensionSearch.open()
  await ExtensionSearch.handleInput(extensionId)
  const disableButton = Locator('.ExtensionActionButton', { hasText: 'Disable' })
  await expect(disableButton).toBeVisible()
  // eslint-disable-next-line e2e/no-direct-click -- exercise the extension search action while the running view remains open
  await disableButton.click()

  await expect(runningExtensionsView).toBeVisible()
  await expect(runningExtension).toBeHidden()

  const enableButton = Locator('.ExtensionActionButton', { hasText: 'Enable' })
  await expect(enableButton).toBeVisible()
  // eslint-disable-next-line e2e/no-direct-click -- restore the fixture through the same extension search action
  await enableButton.click()
}
