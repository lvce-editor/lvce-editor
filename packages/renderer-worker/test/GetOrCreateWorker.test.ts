import { expect, jest, test } from '@jest/globals'
import * as GetOrCreateWorker from '../src/parts/GetOrCreateWorker/GetOrCreateWorker.js'

test('dispose does not launch an unused worker', async () => {
  const launch = jest.fn()
  const worker = GetOrCreateWorker.getOrCreateWorker(launch)

  await worker.dispose()

  expect(launch).not.toHaveBeenCalled()
})
