import type { Test } from '@lvce-editor/test-with-playwright'
import {
  addWorkspaceLifecycleExtension,
  disableLifecycleExtension,
  enableLifecycleExtension,
  extensionId,
  runningExtensionSelector,
  statusBarItemSelector,
} from '../fixtures/sample.extension-disable-lifecycle/test.js'

export const name = 'extension.disable-refreshes-source-control-contributions'

export const test: Test = async ({ Command, expect, Locator, RunningExtensions, SourceControl, ...api }) => {
  await addWorkspaceLifecycleExtension({ Command, ...api })
  await SourceControl.show()

  const sourceControlItem = Locator('.ActivityBarItem[title="Source Control"]')
  const sourceControlBadge = sourceControlItem.locator('.ActivityBarItemBadge')
  const statusBarItem = Locator(statusBarItemSelector)
  await expect(sourceControlBadge).toHaveText('3')
  await expect(statusBarItem).toBeVisible()

  await disableLifecycleExtension(api)

  await expect(sourceControlBadge).toHaveCount(0)
  const badgeCounts = await Command.execute('Layout.getBadgeCounts')
  if (badgeCounts['Source Control'] !== 0) {
    throw new Error(`Expected source control badge count to be 0, got ${badgeCounts['Source Control']}`)
  }
  await expect(statusBarItem).toBeHidden()

  await SourceControl.show()
  const message = Locator('.Viewlet.SourceControl > .Message')
  await expect(message).toBeVisible()
  await expect(message).toHaveText('All installed source control extensions are disabled.')

  await RunningExtensions.show()
  const runningExtension = Locator(runningExtensionSelector, { hasText: extensionId })
  await expect(runningExtension).toBeHidden()
  await enableLifecycleExtension({ Command, ...api })
}
