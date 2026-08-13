import type { Test } from '@lvce-editor/test-with-playwright'
import { activateFixture } from '../fixtures/running-extensions-test-helpers.js'

export const name = 'notification-center.extension-notification'

export const test: Test = async ({ Command, expect, Locator, ...api }) => {
  const extensionId = 'sample.notification-center'
  const activationEvent = 'onCommand:notificationCenter.showTestNotification'
  await activateFixture({ ...api, Command }, extensionId, activationEvent)

  const bell = Locator('.StatusBarItem[name="Notifications"]')
  await expect(bell).toHaveAttribute('aria-label', '1 Notification')
  await bell.click()

  const notificationCenter = Locator('.NotificationCenter')
  await expect(notificationCenter).toBeVisible()
  await expect(notificationCenter).toContainText(extensionId)
  await expect(notificationCenter).toContainText('Build complete')

  await notificationCenter.locator(`button[name="hide:${extensionId}"]`).click()
  await expect(notificationCenter).toContainText('No new notifications')
  await expect(bell).toHaveAttribute('aria-label', 'No Notifications')

  await Command.execute('ExtensionHost.executeCommand', 'notificationCenter.showTestNotification')
  await expect(notificationCenter).toContainText('No new notifications')
  await expect(bell).toHaveAttribute('aria-label', 'No Notifications')
}
