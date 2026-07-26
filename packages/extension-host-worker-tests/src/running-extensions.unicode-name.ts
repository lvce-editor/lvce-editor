import type { Test } from '@lvce-editor/test-with-playwright'
import { activateFixture, getRunningExtension } from '../fixtures/running-extensions-test-helpers.js'

export const name = 'running-extensions.unicode-name'

export const test: Test = async (api) => {
  const id = 'sample.running-extensions-rich'
  await activateFixture(api, id, 'onCommand:runningExtensions.rich')
  const row = await getRunningExtension(api, id)

  await api.expect(row.locator('.RunningExtensionName')).toHaveText('扩展 Runtime 🚀')
}
