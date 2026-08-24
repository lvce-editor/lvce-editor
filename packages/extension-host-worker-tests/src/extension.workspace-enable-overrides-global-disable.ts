import type { Test } from '@lvce-editor/test-with-playwright'
import {
  activateLifecycleExtension,
  addWorkspaceLifecycleExtension,
  enableLifecycleExtension,
  enableWorkspaceLifecycleExtension,
  extensionId,
  runningExtensionSelector,
} from '../fixtures/sample.extension-disable-lifecycle/test.js'

export const name = 'extension.workspace-enable-overrides-global-disable'

export const test: Test = async ({ expect, ExtensionDetail, Locator, RunningExtensions, ...api }) => {
  await addWorkspaceLifecycleExtension(api)
  await ExtensionDetail.open(extensionId)
  await ExtensionDetail.handleClickDisable()
  await RunningExtensions.show()
  const runningExtension = Locator(runningExtensionSelector, { hasText: extensionId })
  await expect(runningExtension).toBeHidden()

  await enableWorkspaceLifecycleExtension({ ExtensionDetail, ...api })
  await activateLifecycleExtension(api)
  await RunningExtensions.show()

  await expect(runningExtension).toBeVisible()
  await enableLifecycleExtension({ ExtensionDetail, ...api })
}
