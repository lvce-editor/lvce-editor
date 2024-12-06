import { expect, test } from '@jest/globals'
import { Writable } from 'node:stream'
import * as HttpServerResponseStream from '../src/parts/HttpServerResponseStream/HttpServerResponseStream.js'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import { writeFile } from 'node:fs/promises'

test('send', async () => {
  const tmpFile = join(tmpdir(), randomUUID() + '-file.txt')
  await writeFile(tmpFile, 'abc')
  const request = {}
  let output = ''
  const socket = new Writable({
    write(chunk, encoding, callback) {
      output += chunk
      callback()
    },
  })
  await HttpServerResponseStream.send(request, socket, tmpFile)
  expect(output).toContain(`HTTP/1.1 200 OK`)
  expect(output).toContain('Connection: close')
})
