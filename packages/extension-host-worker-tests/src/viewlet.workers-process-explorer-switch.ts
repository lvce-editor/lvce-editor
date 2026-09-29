import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.workers-process-explorer-switch'

export const test: Test = async ({ Command, expect, Locator, Main, QuickPick }) => {
  const openWorkers = async () => {
    await QuickPick.open()
    await QuickPick.setValue('>workers')
    await QuickPick.selectItem('Developer: Open Workers View')
  }

  await openWorkers()
  const workersView = Locator('.WorkersView')
  const workersTable = workersView.locator('[role="table"][aria-label="Workers"]')
  await expect(workersTable).toBeVisible()

  for (let i = 0; i < 2; i++) {
    await Command.execute('Developer.openProcessExplorer')
    await expect(Locator('.ProcessExplorerTable')).toBeVisible()
    await expect(Locator('.ViewletErrorMessage')).toHaveCount(0)
    await Main.closeActiveEditor()
    await expect(workersView).toBeVisible()
    await expect(workersTable).toBeVisible()
    await Command.execute('Workers.refresh')
    await expect(workersTable).toBeVisible()
  }

  await Main.closeActiveEditor()
  await openWorkers()
  await expect(workersTable).toBeVisible()
  await Command.execute('Developer.openProcessExplorer')
  await expect(Locator('.ProcessExplorerTable')).toBeVisible()
  await expect(Locator('.ViewletErrorMessage')).toHaveCount(0)
}
