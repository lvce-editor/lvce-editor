import type { Test } from '@lvce-editor/test-with-playwright'
import {
  addLifecycleExtension,
  disableLifecycleExtension,
  enableLifecycleExtension,
  extensionId,
  runningExtensionSelector,
} from '../fixtures/sample.extension-disable-lifecycle/test.js'

export const name = 'extension.enable-restores-running-extension'

export const test: Test = async ({ expect, ExtensionDetail, Locator, RunningExtensions, ...api }) => {
  await addLifecycleExtension(api)
  await RunningExtensions.show()
  const runningExtension = Locator(runningExtensionSelector)
  await expect(runningExtension.locator('.RunningExtensionId')).toHaveText(extensionId)
  await disableLifecycleExtension({ ExtensionDetail })
  await RunningExtensions.show()
  await expect(runningExtension).toBeHidden()

  await ExtensionDetail.open(extensionId)
  await enableLifecycleExtension({ ExtensionDetail })
  await RunningExtensions.show()

  await expect(runningExtension).toBeVisible()
  await expect(runningExtension.locator('.RunningExtensionId')).toHaveText(extensionId)
}
