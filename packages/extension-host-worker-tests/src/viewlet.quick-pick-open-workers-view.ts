import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.quick-pick-open-workers-view'

export const test: Test = async ({ expect, Locator, QuickPick }) => {
  await QuickPick.open()
  await QuickPick.setValue('>workers')

  const command = Locator('.QuickPickItem', { hasText: 'Developer: Open Workers View' })
  await expect(command).toBeVisible()
  await QuickPick.selectItem('Developer: Open Workers View')

  const view = Locator('.WorkersView')
  await expect(view.locator('h1')).toHaveText('Workers')
  await expect(view.locator('[role="table"][aria-label="Workers"]')).toBeVisible()
}
