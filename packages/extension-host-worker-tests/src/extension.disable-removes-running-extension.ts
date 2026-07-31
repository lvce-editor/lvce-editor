import type { Test } from '@lvce-editor/test-with-playwright'
import {
  addLifecycleExtension,
  disableLifecycleExtension,
  enableLifecycleExtension,
  extensionId,
  runningExtensionSelector,
} from '../fixtures/sample.extension-disable-lifecycle/test.js'

export const name = 'extension.disable-removes-running-extension'

export const test: Test = async ({ expect, Locator, RunningExtensions, ...api }) => {
  await addLifecycleExtension(api)
  await RunningExtensions.show()
  const runningExtension = Locator(runningExtensionSelector, { hasText: extensionId })
  await expect(runningExtension).toBeVisible()
  await expect(runningExtension).toHaveText(extensionId)

  await disableLifecycleExtension(api)
  await RunningExtensions.show()

  await expect(runningExtension).toBeHidden()
  await enableLifecycleExtension(api)
}
