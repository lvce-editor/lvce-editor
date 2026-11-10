import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, stat } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { bundleTypeScriptLanguageServer, getTypeScriptTarget } from '../src/parts/BundleTypeScriptLanguageServer/BundleTypeScriptLanguageServer.ts'

const temporary = await mkdtemp(join(tmpdir(), 'lvce-ts7-target-test-'))
try {
  for (const [platform, arch] of [
    ['linux', 'x64'],
    ['linux', 'arm64'],
    ['linux', 'armv7l'],
    ['darwin', 'x64'],
    ['darwin', 'arm64'],
    ['win32', 'x64'],
    ['win32', 'arm64'],
  ]) {
    const target = getTypeScriptTarget(platform, arch)
    const to = join(temporary, target.target)
    await bundleTypeScriptLanguageServer({ arch, platform, to })
    const binary = await readFile(join(to, 'lib', target.executable))
    if (platform === 'linux') {
      assert.equal(binary.subarray(0, 4).toString('hex'), '7f454c46')
      assert.equal(binary.readUInt16LE(18), arch === 'x64' ? 62 : arch === 'arm64' ? 183 : 40)
    } else if (platform === 'win32') {
      assert.equal(binary.subarray(0, 2).toString(), 'MZ')
      assert.equal(binary.readUInt16LE(binary.readUInt32LE(60) + 4), arch === 'x64' ? 0x8664 : 0xaa64)
    } else {
      assert.equal(binary.readUInt32LE(0), 0xfeedfacf)
      assert.equal(binary.readUInt32LE(4), arch === 'x64' ? 0x1000007 : 0x100000c)
    }
    assert((await stat(join(to, 'lib', 'lib.esnext.d.ts'))).size > 0)
    assert((await stat(join(to, 'LICENSE'))).size > 0)
    console.log(`Verified ${target.target}: executable architecture, standard libraries and license`)
  }
} finally {
  await rm(temporary, { force: true, recursive: true })
}
