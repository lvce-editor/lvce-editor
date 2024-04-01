// TODO throws error Error: Not implemented: HTMLCanvasElement.prototype.getContext (without installing the canvas npm package)

/**
 * @jest-environment jsdom
 */
// import * as Terminal from '../src/parts/Terminal/Terminal.ts'
import { expect, test } from '@jest/globals'

test.skip('create', () => {
  // @ts-ignore
  const state = Terminal.create()
  expect(state).toBeDefined()
})

test.skip('write', () => {
  // @ts-ignore
  const state = Terminal.create()
  // @ts-ignore
  Terminal.write(state, 'abc')
})
