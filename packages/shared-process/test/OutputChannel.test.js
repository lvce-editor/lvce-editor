import { createWriteStream } from 'node:fs'
import * as fs from 'node:fs/promises'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { jest } from '@jest/globals'
import waitForExpect from 'wait-for-expect'
import * as OutputChannel from '../src/parts/OutputChannel/OutputChannel.js'
import * as Platform from '../src/parts/Platform/Platform.js'

const getTmpDir = () => {
  return mkdtemp(join(tmpdir(), 'foo-'))
}

if (Platform.isWindows()) {
  test.todo('output channel test')
} else {
  test('writing to channel via stream', async () => {
    const tmpDir = await getTmpDir()
    await fs.writeFile(join(tmpDir, 'log.txt'), '')
    const onData = jest.fn()
    const state = OutputChannel.open(join(tmpDir, 'log.txt'), onData)
    const writeStream = createWriteStream(join(tmpDir, 'log.txt'))
    writeStream.write('a')
    await waitForExpect(() => {
      expect(onData).toHaveBeenNthCalledWith(1, 'a')
    })
    writeStream.write('b')
    await waitForExpect(() => {
      expect(onData).toHaveBeenNthCalledWith(2, 'b')
    })
    writeStream.write('c')
    writeStream.close()
    await waitForExpect(() => {
      expect(onData).toHaveBeenNthCalledWith(3, 'c')
    })
    OutputChannel.dispose(state)
  })

  test('writing to channel', async () => {
    const tmpDir = await getTmpDir()
    await fs.writeFile(join(tmpDir, 'log.txt'), '')
    const onData = jest.fn()
    const state = OutputChannel.open(join(tmpDir, 'log.txt'), onData)
    await fs.writeFile(join(tmpDir, 'log.txt'), 'abc\n')
    await waitForExpect(() => {
      expect(onData).toHaveBeenCalledWith('abc\n')
    })
    OutputChannel.dispose(state)
  })

  test('non-existing file', async () => {
    const tmpDir = await getTmpDir()
    const onData = jest.fn()
    const onError = jest.fn()
    const state = OutputChannel.open(
      join(tmpDir, 'non-existing-file.txt'),
      onData,
      onError
    )
    expect(onError).toHaveBeenCalledWith(
      expect.stringMatching(
        /^Error: ENOENT: no such file or directory, access /
      )
    )
    OutputChannel.dispose(state)
  })
}
