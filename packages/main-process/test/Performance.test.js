import * as Performance from '../src/parts/Performance/Performance.cjs'

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
