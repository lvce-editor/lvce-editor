import type { Test } from '@lvce-editor/test-with-playwright'
import {
  addLifecycleExtension,
  disableWorkspaceLifecycleExtension,
  enableLifecycleExtension,
  workspaceUri,
} from '../fixtures/sample.extension-disable-lifecycle/test.js'

export const name = 'extension.workspace-storage-does-not-clutter-project'

export const test: Test = async ({ ExtensionDetail, FileSystem, Locator, ...api }) => {
  await addLifecycleExtension(api)
  await disableWorkspaceLifecycleExtension({ ExtensionDetail, Locator, ...api })

  const entries = await FileSystem.readDir(workspaceUri)
  if (entries.some((entry) => entry.name === '.lvce')) {
    throw new Error('workspace extension enablement must not create a .lvce folder in the project')
  }
  await enableLifecycleExtension({ ExtensionDetail, ...api })
}
