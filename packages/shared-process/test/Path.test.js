import * as Path from '../src/parts/Path/Path.js'
import * as Process from '../src/parts/Process/Process.js'

test('join', () => {
  if (Process.platform === 'win32') {
    expect(Path.join('test', 'my-file.txt')).toBe('test\\my-file.txt')
  } else {
    expect(Path.join('test', 'my-file.txt')).toBe('test/my-file.txt')
  }
})

test('dirname', () => {
  if (Process.platform === 'win32') {
    expect(Path.dirname('test\\my-file.txt')).toBe('test')
  } else {
    expect(Path.dirname('test/my-file.txt')).toBe('test')
  }
})
