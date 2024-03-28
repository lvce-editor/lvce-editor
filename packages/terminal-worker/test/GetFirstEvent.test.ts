import * as GetFirstEvent from '../src/parts/GetFirstEvent/GetFirstEvent.ts'
import { test, expect } from '@jest/globals'

test('getFirstEvent', async () => {
  const eventTarget = new EventTarget()
  const eventMap = {
    a: 1,
  }
  const promise = GetFirstEvent.getFirstEvent(eventTarget, eventMap)
  const event = new Event('a')
  eventTarget.dispatchEvent(event)
  expect(await promise).toEqual({
    type: 1,
    event,
  })
})
