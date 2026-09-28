import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'notification.options'

export const test: Test = async ({ Command, expect, Locator }) => {
  const choice = Command.execute('Notification.showWithOptions', 'info', 'There are no changes to commit', ['Create Empty Commit'])
  const notification = Locator('.Notification')
  const option = notification.locator('.NotificationOption')
  await expect(option).toHaveText('Create Empty Commit')
  await option.click()
  if ((await choice) !== 0) {
    throw new Error('The notification did not return the selected option')
  }
  await expect(notification).toBeHidden()

  const dismissed = Command.execute('Notification.showWithOptions', 'info', 'There are no changes to commit', ['Create Empty Commit'])
  await expect(option).toBeVisible()
  await notification.locator('[aria-label="Close"]').click()
  if ((await dismissed) !== undefined) {
    throw new Error('Dismissing the notification selected an action')
  }
  await expect(notification).toBeHidden()
}
