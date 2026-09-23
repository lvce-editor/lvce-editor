import { expect, test } from '@jest/globals'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { crc32, deflateRawSync } from 'node:zlib'
import { extractZip } from '../src/parts/ExtractZip/ExtractZip.ts'

test('extracts a deflated file and finishes the archive stream', async () => {
  // Exceed the stream high-water mark with incompressible DEFLATE data.
  const content = Buffer.alloc(256 * 1024)
  let state = 42
  for (let i = 0; i < content.length; i++) {
    state ^= state << 13
    state ^= state >>> 17
    state ^= state << 5
    content[i] = state & 0xff
  }
  const compressed = deflateRawSync(content)
  const name = Buffer.from('nested/example.txt')
  const local = Buffer.alloc(30)
  local.writeUInt32LE(0x04034b50)
  local.writeUInt16LE(20, 4)
  local.writeUInt16LE(8, 8)
  local.writeUInt32LE(crc32(content), 14)
  local.writeUInt32LE(compressed.length, 18)
  local.writeUInt32LE(content.length, 22)
  local.writeUInt16LE(name.length, 26)
  const central = Buffer.alloc(46)
  central.writeUInt32LE(0x02014b50)
  central.writeUInt16LE(20, 4)
  local.copy(central, 6, 4, 30)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50)
  end.writeUInt16LE(1, 8)
  end.writeUInt16LE(1, 10)
  end.writeUInt32LE(central.length + name.length, 12)
  end.writeUInt32LE(local.length + name.length + compressed.length, 16)
  const archive = Buffer.concat([local, name, compressed, central, name, end])
  const root = await mkdtemp(join(tmpdir(), 'lvce-extract-zip-'))
  try {
    const inFile = join(root, 'archive.zip')
    const outDir = join(root, 'output')
    await writeFile(inFile, archive)
    await extractZip({ inFile, outDir })
    expect(await readFile(join(outDir, 'nested/example.txt'))).toEqual(content)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
