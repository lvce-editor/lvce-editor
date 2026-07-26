import type { Test } from '@lvce-editor/test-with-playwright'
import { activateFixture, getRunningExtension } from '../fixtures/running-extensions-test-helpers.js'

export const name = 'running-extensions.delayed-activation'

export const test: Test = async (api) => {
  const id = 'sample.running-extensions-delayed'
  await activateFixture(api, id, 'onCommand:runningExtensions.delayed')
  const row = await getRunningExtension(api, id)

  await api.expect(row.locator('.RunningExtensionName')).toHaveText('Delayed Activation')
}
