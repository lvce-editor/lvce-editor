import type { Test } from '@lvce-editor/test-with-playwright'
import { activateFixture, getRunningExtension, wait } from '../fixtures/running-extensions-test-helpers.js'

export const name = 'running-extensions.terminates-immediately'

export const test: Test = async (api) => {
  const id = 'sample.running-extensions-close-immediately'
  await activateFixture(api, id, 'onCommand:runningExtensions.closeImmediately')
  await wait(400)
  const row = await getRunningExtension(api, id)

  await api.expect(row.locator('.RunningExtensionStatusTerminated')).toContainText('Terminated:')
}
