import type { Test } from '@lvce-editor/test-with-playwright'
import { activateFixture, getRunningExtension } from '../fixtures/running-extensions-test-helpers.js'

export const name = 'running-extensions.activation-reason'

export const test: Test = async (api) => {
  const id = 'sample.running-extensions-rich'
  const event = 'onCommand:runningExtensions.rich'
  await activateFixture(api, id, event)
  const row = await getRunningExtension(api, id)

  await api.expect(row.locator('.RunningExtensionActivationReason')).toHaveText(`Activation reason: ${event}`)
}
