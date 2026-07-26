import type { Test } from '@lvce-editor/test-with-playwright'
import { activateFixture, getRunningExtension } from '../fixtures/running-extensions-test-helpers.js'

export const name = 'running-extensions.activation-timeout'

export const test: Test = async (api) => {
  const id = 'sample.running-extensions-timeout'
  await activateFixture(api, id, 'onCommand:runningExtensions.timeout')
  const row = await getRunningExtension(api, id)

  await api.expect(row.locator('.RunningExtensionStatusError')).toContainText('Activation timeout of 10000ms exceeded')
}
