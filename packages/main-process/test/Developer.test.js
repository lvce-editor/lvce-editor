const Developer = require('../src/parts/ElectronDeveloper/ElectronDeveloper.js')

test('getPerformanceEntries', () => {
  // see https://github.com/facebook/jest/issues/11629
  globalThis.performance = {
    getEntries() {
      return []
    },
    timeOrigin: 78,
  }
  expect(Developer.getPerformanceEntries()).toEqual({
    entries: expect.any(Array),
    timeOrigin: expect.any(Number),
  })
})
