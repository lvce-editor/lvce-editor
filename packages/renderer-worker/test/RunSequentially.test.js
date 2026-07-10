import { expect, jest, test } from '@jest/globals'
import * as RunSequentially from '../src/parts/RunSequentially/RunSequentially.js'

const createDeferred = () => {
  let resolve = () => {}
  /** @type {Promise<void>} */
  const promise = new Promise((resolvePromise) => {
    resolve = resolvePromise
  })
  return { promise, resolve }
}

test('runs actions one at a time', async () => {
  const deferred = createDeferred()
  const calls = []
  const first = jest.fn(async (...args) => {
    calls.push(['first-start', ...args])
    await deferred.promise
    calls.push(['first-end', ...args])
  })
  const second = jest.fn(async (...args) => {
    calls.push(['second', ...args])
  })

  const promise = RunSequentially.runSequentially([first, second], 'electron', '/assets')
  await Promise.resolve()

  expect(first).toHaveBeenCalledWith('electron', '/assets')
  expect(second).not.toHaveBeenCalled()

  deferred.resolve()
  await promise

  expect(calls).toEqual([
    ['first-start', 'electron', '/assets'],
    ['first-end', 'electron', '/assets'],
    ['second', 'electron', '/assets'],
  ])
})
