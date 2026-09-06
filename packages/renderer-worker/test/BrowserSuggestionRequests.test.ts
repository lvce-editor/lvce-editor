import { afterEach, expect, jest, test } from '@jest/globals'
import * as Requests from '../src/parts/BrowserSuggestionRequests/BrowserSuggestionRequests.js'

afterEach(() => {
  Requests.cancel(7)
  jest.useRealTimers()
})

test('debounces requests for 150ms and sends only the most recent query', async () => {
  jest.useFakeTimers()
  const request = jest.fn(async (query: string) => [query])
  const apply = jest.fn()
  Requests.begin(7, 10, 'first', request, apply)
  await jest.advanceTimersByTimeAsync(100)
  Requests.begin(7, 10, 'second', request, apply)
  await jest.advanceTimersByTimeAsync(149)
  expect(request).not.toHaveBeenCalled()
  await jest.advanceTimersByTimeAsync(1)
  expect(request).toHaveBeenCalledWith('second')
  expect(apply).toHaveBeenCalledWith(expect.any(Number), ['second'])
})

test.each(['new query', 'same query', 'tab switch', 'dismissal'])('rejects pending results after %s', async (change) => {
  jest.useFakeTimers()
  const pending = Promise.withResolvers<string[]>()
  const apply = jest.fn()
  Requests.begin(7, 10, 'query', () => pending.promise, apply)
  await jest.advanceTimersByTimeAsync(150)
  if (change === 'dismissal') Requests.cancel(7)
  else Requests.begin(7, change === 'tab switch' ? 11 : 10, change === 'new query' ? 'other' : 'query', undefined, apply)
  pending.resolve(['stale'])
  await jest.advanceTimersByTimeAsync(0)
  expect(apply).not.toHaveBeenCalled()
})

test('provider rejection becomes an empty update without ending the active session', async () => {
  jest.useFakeTimers()
  const apply = jest.fn()
  const id = Requests.begin(
    7,
    10,
    'query',
    async () => {
      throw new Error('offline')
    },
    apply,
  )
  await jest.advanceTimersByTimeAsync(150)
  expect(apply).toHaveBeenCalledWith(id, [])
  expect(Requests.isCurrent(7, id, 10)).toBe(true)
})
