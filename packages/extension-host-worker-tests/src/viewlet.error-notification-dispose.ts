import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.error-notification-dispose'

export const test: Test = async ({ Command, expect, Locator }) => {
  const id = await Command.execute('Notification.create', 'info', 'Continue signing in')
  await expect(Locator('.NotificationMessage')).toHaveText('Continue signing in')
  await Command.execute('Notification.create', 'error', 'Unrelated error')
  await expect(Locator('.Notification')).toHaveCount(2)

  await Command.execute('Notification.dispose', id)

  await expect(Locator('.Notification')).toHaveCount(1)
  await expect(Locator('.NotificationMessage')).toHaveText('Unrelated error')
  await Locator('.NotificationCloseButton').click()
  await Command.execute('Notification.dispose', id)
  await expect(Locator('.Notification')).toHaveCount(0)
}
