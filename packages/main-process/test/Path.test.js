const Path = require('../src/parts/Path/Path.cjs')

test('absolute', () => {
  // TODO need better test here
  expect(Path.absolute('./some-file.txt')).toContain('some-file.txt')
})
