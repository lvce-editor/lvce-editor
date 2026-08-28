import { afterEach, expect, jest, test } from '@jest/globals'
import * as RemoteCli from '../src/parts/RemoteCli/RemoteCli.ts'

afterEach(() => {
  RemoteCli._reset()
  jest.useRealTimers()
})

test('delivers an open request to the most recently connected window', async () => {
  const first = RemoteCli.waitForOpenRequest()
  const second = RemoteCli.waitForOpenRequest()
  const request = { kind: 'folder' as const, path: '/home/test/project' }

  expect(RemoteCli.open(request)).toBe(true)
  await expect(second).resolves.toEqual(request)

  RemoteCli._reset()
  await expect(first).resolves.toBeUndefined()
})

test('reports when no connected window is waiting', () => {
  expect(RemoteCli.open({ kind: 'folder', path: '/home/test/project' })).toBe(
    false,
  )
})

test('rejects invalid requests', () => {
  expect(() => RemoteCli.open({ kind: 'folder', path: 'relative' })).toThrow(
    'Invalid remote CLI open request',
  )
})

test('expires disconnected window waiters', async () => {
  jest.useFakeTimers()
  const request = RemoteCli.waitForOpenRequest(1000)

  await jest.advanceTimersByTimeAsync(1000)

  await expect(request).resolves.toBeUndefined()
  expect(RemoteCli.open({ kind: 'folder', path: '/home/test/project' })).toBe(
    false,
  )
})
