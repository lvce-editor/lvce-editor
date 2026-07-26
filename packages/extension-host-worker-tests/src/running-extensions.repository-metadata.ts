import type { Test } from '@lvce-editor/test-with-playwright'
import { activateFixture, getRunningExtension } from '../fixtures/running-extensions-test-helpers.js'

export const name = 'running-extensions.repository-metadata'

export const test: Test = async (api) => {
  const id = 'sample.running-extensions-rich'
  await activateFixture(api, id, 'onCommand:runningExtensions.rich')
  const row = await getRunningExtension(api, id)

  await api.expect(row.locator('.RunningExtensionId')).toHaveText(id)
  await api.expect(row).toHaveAttribute('role', 'listitem')
}
