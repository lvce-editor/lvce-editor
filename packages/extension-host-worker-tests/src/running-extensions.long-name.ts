import type { Test } from '@lvce-editor/test-with-playwright'
import { activateFixture, getRunningExtension } from '../fixtures/running-extensions-test-helpers.js'

export const name = 'running-extensions.long-name'

export const test: Test = async (api) => {
  const id = 'sample.running-extensions-long-name'
  await activateFixture(api, id, 'onCommand:runningExtensions.longName')
  const row = await getRunningExtension(api, id)

  await api.expect(row.locator('.RunningExtensionName')).toContainText('deliberately very long extension display name')
  await api.expect(row).toBeVisible()
}
