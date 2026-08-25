export const extensionId = 'sample.running-extensions-live-view'

export const activityBarItemSelector = '.ActivityBarItem[title="Running Extensions Live View"]'

export const runningExtensionSelector = '.RunningExtensionId'

export const addLiveViewExtension = async ({ ActivityBar, Extension }) => {
  await Extension.addWebExtension(new URL('.', import.meta.url).toString())
  await ActivityBar.handleExtensionsChanged()
}

export const activateLiveViewExtension = async ({ expect, Locator }) => {
  const activityBarItem = Locator(activityBarItemSelector)
  await expect(activityBarItem).toBeVisible()
  // eslint-disable-next-line e2e/no-direct-click
  await activityBarItem.click()
  await new Promise((resolve) => setTimeout(resolve, 500))
}

export const deactivateLiveViewExtension = async ({ expect, Locator }) => {
  const activityBarItem = Locator(activityBarItemSelector)
  await expect(activityBarItem).toBeVisible()
  // eslint-disable-next-line e2e/no-direct-click
  await activityBarItem.click()
  await new Promise((resolve) => setTimeout(resolve, 500))
}
