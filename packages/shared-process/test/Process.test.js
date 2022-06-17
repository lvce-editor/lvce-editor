import * as Process from '../src/parts/Process/Process.js'

test('crash', () => {
  expect(Process.crash).toThrow()
})

test('crashAsync', () => {
  expect(Process.crashAsync).rejects.toThrow()
})
