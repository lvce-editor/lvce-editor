/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import * as Transferrable from '../src/parts/Transferrable/Transferrable.ts'

test('transfer and acquire', () => {
  const id = 1
  const value = 2
  Transferrable.transfer(id, value)
  expect(Transferrable.acquire(id)).toBe(value)
})

test('item should be deleted after acquiring', () => {
  const id = 1
  const value = 2
  Transferrable.transfer(id, value)
  Transferrable.acquire(id)
  expect(Transferrable.acquire(id)).toBe(undefined)
})
