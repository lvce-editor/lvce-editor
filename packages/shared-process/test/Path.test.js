import * as Path from '../src/parts/Path/Path.js'

test('join', () => {
  if (process.platform === 'win32') {
    expect(Path.join('test', 'my-file.txt')).toBe('test\\my-file.txt')
  } else {
    expect(Path.join('test', 'my-file.txt')).toBe('test/my-file.txt')
  }
})

test('dirname', () => {
  if (process.platform === 'win32') {
    expect(Path.dirname('test\\my-file.txt')).toBe('test')
  } else {
    expect(Path.dirname('test/my-file.txt')).toBe('test')
  }
})
