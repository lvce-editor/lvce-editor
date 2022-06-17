// TODO throws error Error: Not implemented: HTMLCanvasElement.prototype.getContext (without installing the canvas npm package)

/**
 * @jest-environment jsdom
 */
// import * as Terminal from '../src/parts/Terminal/Terminal.js'

test.skip('create', () => {
  const state = Terminal.create()
  expect(state).toBeDefined()
})

test.skip('write', () => {
  const state = Terminal.create()
  Terminal.write(state, 'abc')
})
