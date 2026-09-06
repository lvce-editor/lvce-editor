import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.error-notification'

export const test: Test = async ({ Command, expect, Locator }) => {
  const message = 'Failed to open devcontainer workspace: DevContainerNode.cliUp failed with exit code 1'
  await Command.execute('Notification.create', 'error', message)
  const notification = Locator('.Notification')
  const text = Locator('.NotificationMessage')
  await expect(notification).toBeVisible()
  await expect(text).toHaveText(message)
  await expect(text).toHaveCSS('overflow-wrap', 'anywhere')
  await expect(text).toHaveCSS('overflow-y', 'auto')
  await Locator('.NotificationCloseButton').click()
  await expect(notification).toHaveCount(0)
}
