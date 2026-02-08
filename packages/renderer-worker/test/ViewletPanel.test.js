import { expect, test } from '@jest/globals'
import * as ViewletPanel from '../src/parts/ViewletPanel/ViewletPanel.js'

test('create', () => {
  const state = ViewletPanel.create()
  expect(state).toBeDefined()
})

test.skip('loadContent', async () => {
  const state = ViewletPanel.create()
  expect(await ViewletPanel.loadContent(state)).toEqual({
    disposed: false,
    src: 'abc',
  })
})

test('dispose', () => {
  const state = ViewletPanel.create()
  expect(ViewletPanel.dispose(state)).toMatchObject({
    disposed: true,
  })
})
