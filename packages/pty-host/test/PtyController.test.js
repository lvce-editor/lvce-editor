import * as PtyController from '../src/parts/PtyController/PtyController.js'

// afterEach(() => {
//   PtyController.disposeAll()
// })

test.skip('create', () => {
  // @ts-ignore
  if (Platform.isWindows) {
    // TODO add windows test
    return
  }
  PtyController.create(1)
})

test.skip('dispose', () => {
  // @ts-ignore
  if (Platform.isWindows) {
    // TODO add windows test
    return
  }
  PtyController.create(1)
  PtyController.create(2)
  // @ts-ignore
  expect(PtyController.state.ptyMap[1]).toBeDefined()
  // @ts-ignore
  expect(PtyController.state.ptyMap[2]).toBeDefined()
  PtyController.dispose(2)
  // @ts-ignore
  expect(PtyController.state.ptyMap[1]).toBeDefined()
  // @ts-ignore
  expect(PtyController.state.ptyMap[2]).toBeUndefined()
  PtyController.dispose(1)
  // @ts-ignore
  expect(PtyController.state.ptyMap[1]).toBeUndefined()
  // @ts-ignore
  expect(PtyController.state.ptyMap[2]).toBeUndefined()
})
