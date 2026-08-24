import type { Test } from '@lvce-editor/test-with-playwright'
import {
  addLifecycleExtension,
  disableWorkspaceLifecycleExtension,
  enableLifecycleExtension,
  extensionId,
  runningExtensionSelector,
} from '../fixtures/sample.extension-disable-lifecycle/test.js'

export const name = 'extension.workspace-disable-removes-running-extension'

export const test: Test = async ({ expect, ExtensionDetail, Locator, RunningExtensions, ...api }) => {
  await addLifecycleExtension(api)
  await RunningExtensions.show()
  const runningExtension = Locator(runningExtensionSelector, { hasText: extensionId })
  await expect(runningExtension).toBeVisible()

  await disableWorkspaceLifecycleExtension({ ExtensionDetail, Locator, ...api })
  await RunningExtensions.show()

  await expect(runningExtension).toBeHidden()
  await enableLifecycleExtension({ ExtensionDetail, ...api })
}
