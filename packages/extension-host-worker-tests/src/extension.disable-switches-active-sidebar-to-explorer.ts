import type { Test } from '@lvce-editor/test-with-playwright'
import { addLifecycleExtension, disableLifecycleExtension, enableLifecycleExtension, viewId } from '../fixtures/sample.extension-disable-lifecycle/test.js'

export const name = 'extension.disable-switches-active-sidebar-to-explorer'

export const test: Test = async ({ expect, Locator, SideBar, ...api }) => {
  await addLifecycleExtension(api)
  await SideBar.open(viewId)
  const sideBarTitle = Locator('.SideBarTitleAreaTitle')
  await expect(sideBarTitle).toHaveText('Extension Lifecycle')

  await disableLifecycleExtension(api)

  await expect(sideBarTitle).toHaveText('extension.disable-switches-active-sidebar-to-explorer.html')
  await enableLifecycleExtension(api)
}
