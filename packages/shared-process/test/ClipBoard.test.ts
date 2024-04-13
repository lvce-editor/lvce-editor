import { expect, jest, test, afterEach } from '@jest/globals'

jest.unstable_mockModule('../src/parts/Exec/Exec.js', () => ({
  exec: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

jest.unstable_mockModule('../src/parts/Desktop/Desktop.js', () => ({
  getDesktop: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

const Exec = await import('../src/parts/Exec/Exec.js')
const Desktop = await import('../src/parts/Desktop/Desktop.js')
const ClipBoard = await import('../src/parts/ClipBoard/ClipBoard.js')

afterEach(() => {
  jest.resetAllMocks()
})

test('readFiles - gnome - copied files', async () => {
  // @ts-ignore
  Desktop.getDesktop.mockImplementation(() => 'gnome')
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
    return {
      stdout: `copy
file:///test/my-folder`,
      stderr: '',
    }
  })

  expect(await ClipBoard.readFiles()).toEqual({
    source: 'gnomeCopiedFiles',
    type: 'copy',
    files: ['/test/my-folder'],
  })
})

test('readFiles - gnome - target not available', async () => {
  // @ts-ignore
  Desktop.getDesktop.mockImplementation(() => 'gnome')
  // @ts-ignore
  Exec.exec.mockImplementation(() => {
    const error = new Error('command failed with exit code 1')
    // @ts-ignore
    error.stderr = 'Error: target x-special/gnome-copied-files not available'
    throw error
  })
  expect(await ClipBoard.readFiles()).toBe(undefined)
})

test('writeFiles - gnome - copied files', async () => {
  // @ts-ignore
  Desktop.getDesktop.mockImplementation(() => 'gnome')
  // @ts-ignore
  Exec.exec.mockImplementation(async () => {
    return { stdout: '', stderr: '' }
  })
  await ClipBoard.writeFiles('copy', ['/test/my-folder'])
  expect(Exec.exec).toHaveBeenCalledTimes(3)
  expect(Exec.exec).toHaveBeenNthCalledWith(1, 'xclip', ['-i', '-selection', 'clipboard', '-t', 'x-special/gnome-copied-files'], {
    input: `copy
file:///test/my-folder`,
  })
  expect(Exec.exec).toHaveBeenNthCalledWith(2, 'xclip', ['-i', '-selection', 'clipboard', '-t', 'text/uri-list'], {
    input: 'file:///test/my-folder',
  })
  expect(Exec.exec).toHaveBeenNthCalledWith(3, 'xclip', ['-i', '-selection', 'clipboard', '-t', 'text/plain'], {
    input: '/test/my-folder',
  })
})

test('writeFiles - unsupported desktop', async () => {
  // @ts-ignore
  Desktop.getDesktop.mockImplementation(() => 'test-desktop')
  // @ts-ignore
  Exec.exec.mockImplementation(async () => {
    return { stdout: '', stderr: '' }
  })
  const consoleSpy = jest.spyOn(console, 'info').mockImplementation(() => {})
  await ClipBoard.writeFiles('copy', ['/test/my-folder'])
  expect(Exec.exec).not.toHaveBeenCalled()
  expect(consoleSpy).toHaveBeenCalledTimes(1)
  expect(consoleSpy).toHaveBeenCalledWith('writing files to clipboard is not yet supported on test-desktop')
})
