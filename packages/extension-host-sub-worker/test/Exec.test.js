import { jest } from '@jest/globals'

jest.unstable_mockModule('execa', () => {
  return {
    execa: jest.fn(),
  }
})

const Execa = await import('execa')
const Exec = await import('../src/parts/Exec/Exec.js')

test('exec - stdout', async () => {
  // @ts-ignore
  Execa.execa.mockImplementation(() => {
    return {
      stdout: 'a',
      stderr: '',
    }
  })
  expect(
    await Exec.exec('node', ['-e', "process.stdout.write('a')"], {})
  ).toEqual({
    stderr: '',
    stdout: 'a',
  })
})

test('exec - error', async () => {
  // @ts-ignore
  Execa.execa.mockImplementation(() => {
    throw new TypeError('x is not a function')
  })
  await expect(
    Exec.exec('node', ['-e', "process.stdout.write('a')"], {})
  ).rejects.toThrowError(new TypeError('x is not a function'))
})
