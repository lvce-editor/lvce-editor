import * as GetWorkerDisplayName from '../src/parts/GetWorkerDisplayName/GetWorkerDisplayName.js'

test('getWorkerDisplayName', () => {
  expect(GetWorkerDisplayName.getWorkerDisplayName('test-worker')).toBe('test-worker')
})
