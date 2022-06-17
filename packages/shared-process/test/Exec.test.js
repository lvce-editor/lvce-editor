import * as Exec from '../src/parts/Exec/Exec.js'

test('exec - stdout', async () => {
  expect(
    await Exec.exec('node', ['-e', "process.stdout.write('a')"], {})
  ).toEqual({
    stderr: '',
    stdout: 'a',
  })
})

test('exec - stderr', async () => {
  expect(
    await Exec.exec('node', ['-e', "process.stderr.write('b')"], {})
  ).toEqual({
    stderr: 'b',
    stdout: '',
  })
})

test('exec - error', async () => {
  await expect(Exec.exec('node', ['-e', 'oops'], {})).rejects.toThrowError(
    'Command failed with exit code 1: node -e oops'
  )
})
