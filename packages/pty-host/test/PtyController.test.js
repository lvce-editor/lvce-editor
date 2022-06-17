import * as PtyController from '../src/parts/PtyController/PtyController.js'
import * as Platform from '../src/parts/Platform/Platform.js'

afterEach(() => {
  PtyController.disposeAll()
})

test('create', () => {
  if (Platform.isWindows) {
    // TODO add windows test
    return
  }
  PtyController.create(1)
})

test('dispose', () => {
  if (Platform.isWindows) {
    // TODO add windows test
    return
  }
  PtyController.create(1)
  PtyController.create(2)
  expect(PtyController.state.ptyMap[1]).toBeDefined()
  expect(PtyController.state.ptyMap[2]).toBeDefined()
  PtyController.dispose(2)
  expect(PtyController.state.ptyMap[1]).toBeDefined()
  expect(PtyController.state.ptyMap[2]).toBeUndefined()
  PtyController.dispose(1)
  expect(PtyController.state.ptyMap[1]).toBeUndefined()
  expect(PtyController.state.ptyMap[2]).toBeUndefined()
})
