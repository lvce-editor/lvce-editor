const Performance = require('../src/parts/Performance/Performance.js')

beforeEach(() => {
  Performance.clearMarks()
})

test('mark', () => {
  Performance.mark('test')
})

test('measure', () => {
  Performance.mark('abc')
  expect(Performance.getEntries()).toEqual([
    {
      detail: null,
      duration: 0,
      entryType: 'mark',
      name: 'abc',
      startTime: expect.any(Number),
    },
  ])
})
