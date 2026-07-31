import assert from 'node:assert/strict'
import { readdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import test from 'node:test'
import {
  buildLaunchSpec,
  collectCdpDiagnostics,
  collectGpuProcess,
  compareRenderers,
  discoverPortOwnerPids,
  isOwnedCommandLine,
  parseArguments,
  parseCommandLine,
  parseSmaps,
  parseSmapsRollup,
  runComparison,
  runWithCleanup,
} from '../diagnose-gpu-process-lib.mjs'

test('parseSmapsRollup converts Linux memory fields to camel-case kilobytes', () => {
  const result = parseSmapsRollup(`Rss:              167304 kB
Pss:               66647 kB
Shared_Clean:     120552 kB
Private_Dirty:     27152 kB
Anonymous:         27056 kB
Swap:                  0 kB
`)

  assert.deepEqual(result, {
    anonymousKb: 27056,
    privateDirtyKb: 27152,
    pssKb: 66647,
    rssKb: 167304,
    sharedCleanKb: 120552,
    swapKb: 0,
  })
})

test('parseSmaps groups resident memory by mapped file', () => {
  const result = parseSmaps(`1000-2000 r-xp 00000000 08:01 1 /usr/lib/libLLVM.so
Rss:                  40 kB
Pss:                  20 kB
Private_Dirty:         4 kB
2000-3000 rw-p 00000000 00:00 0
Rss:                  12 kB
Pss:                  12 kB
Private_Dirty:        12 kB
3000-4000 rw-s 00000000 00:01 2 /SYSV00000000 (deleted)
Rss:                   8 kB
Pss:                   4 kB
`)

  assert.deepEqual(result, [
    { path: '/usr/lib/libLLVM.so', privateDirtyKb: 4, pssKb: 20, rssKb: 40 },
    { path: '[anonymous]', privateDirtyKb: 12, pssKb: 12, rssKb: 12 },
    { path: '/SYSV00000000 (deleted)', privateDirtyKb: 0, pssKb: 4, rssKb: 8 },
  ])
})

test('parseCommandLine decodes proc null-separated arguments', () => {
  assert.deepEqual(parseCommandLine(Buffer.from('/usr/lib/lvce/lvce\0--type=gpu-process\0')), ['/usr/lib/lvce/lvce', '--type=gpu-process'])
})

test('parseArguments supports repeated process and CDP specifications', () => {
  const result = parseArguments(['--gpu-process', 'lvce:123', '--gpu-process=code:456', '--cdp', 'lvce:9333', '--output', '/tmp/report.json'])

  assert.deepEqual(result.gpuProcesses, [
    { label: 'lvce', pid: 123 },
    { label: 'code', pid: 456 },
  ])
  assert.deepEqual(result.cdpEndpoints, [{ label: 'lvce', port: 9333 }])
  assert.equal(result.output, '/tmp/report.json')
})

test('collectGpuProcess preserves permission errors as warnings', async () => {
  const readFile = async (path) => {
    if (path.endsWith('/cmdline')) {
      return Buffer.from('/usr/lib/lvce/lvce\0--type=gpu-process\0')
    }
    const error = new Error('permission denied')
    error.code = 'EACCES'
    throw error
  }

  const result = await collectGpuProcess({
    label: 'lvce',
    pid: 123,
    readFile,
    readdir: async () => [],
  })

  assert.deepEqual(result.commandLine, ['/usr/lib/lvce/lvce', '--type=gpu-process'])
  assert.equal(result.memory, undefined)
  assert.match(result.warnings.join('\n'), /EACCES.*smaps_rollup/)
})

test('collectGpuProcess reports a missing process', async () => {
  const error = new Error('missing')
  error.code = 'ENOENT'

  await assert.rejects(
    collectGpuProcess({ label: 'missing', pid: 999, readFile: async () => Promise.reject(error) }),
    /GPU process 999 does not exist/,
  )
})

test('collectCdpDiagnostics reports an unavailable endpoint without failing collection', async () => {
  const result = await collectCdpDiagnostics({
    port: 9333,
    fetch: async () => {
      throw new Error('connection refused')
    },
  })

  assert.match(result.error, /connection refused/)
})

test('buildLaunchSpec isolates profiles and applies the same Ozone platform', () => {
  const code = buildLaunchSpec({ executable: '/usr/share/code/code', kind: 'code', ozonePlatform: 'wayland', port: 9333, tempRoot: '/tmp/gpu' })
  const lvce = buildLaunchSpec({
    executable: '/usr/bin/lvce',
    kind: 'lvce',
    ozonePlatform: 'wayland',
    port: 9334,
    tempRoot: '/tmp/gpu',
    variant: 'sandbox',
  })

  assert.ok(code.args.includes('--user-data-dir=/tmp/gpu/code/user-data'))
  assert.ok(code.args.includes('--extensions-dir=/tmp/gpu/code/extensions'))
  assert.ok(code.args.includes('--ozone-platform=wayland'))
  assert.equal(code.env.XDG_CACHE_HOME, '/tmp/gpu/code/cache')
  assert.ok(lvce.args.includes('--sandbox'))
  assert.ok(lvce.args.includes('--ozone-platform=wayland'))
  assert.ok(lvce.args.includes('--user-data-dir=/tmp/gpu/lvce-sandbox/user-data'))
  assert.equal(lvce.env.XDG_CACHE_HOME, '/tmp/gpu/lvce-sandbox/cache')
})

test('cleanup ownership only matches the unique profile or debugging port', () => {
  const run = { port: 9333, profileRoot: '/tmp/lvce-gpu-comparison-123/lvce-baseline' }

  assert.equal(isOwnedCommandLine('/usr/bin/lvce\0--remote-debugging-port=9333\0', run), true)
  assert.equal(isOwnedCommandLine('/usr/bin/lvce\0--user-data-dir=/tmp/lvce-gpu-comparison-123/lvce-baseline/user-data\0', run), true)
  assert.equal(isOwnedCommandLine('/usr/bin/lvce\0--remote-debugging-port=9444\0', run), false)
})

test('cleanup finds helper processes that inherited the unique CDP listening socket', async () => {
  const readFile = async (path) => {
    if (path === '/proc/net/tcp') {
      return `  sl  local_address rem_address   st tx_queue rx_queue tr tm->when retrnsmt   uid  timeout inode
   0: 0100007F:A98C 00000000:0000 0A 00000000:00000000 00:00000000 00000000  1000        0 2725522 1
`
    }
    if (path === '/proc/net/tcp6') {
      return ''
    }
    throw new Error(`Unexpected read: ${path}`)
  }
  const readdir = async (path) => {
    if (path === '/proc') {
      return ['100', '101', 'self']
    }
    if (path === '/proc/100/fd') {
      return ['7']
    }
    if (path === '/proc/101/fd') {
      return ['8']
    }
    throw new Error(`Unexpected directory: ${path}`)
  }
  const readlink = async (path) => (path === '/proc/100/fd/7' ? 'socket:[2725522]' : 'socket:[9999999]')

  assert.deepEqual(await discoverPortOwnerPids({ port: 43404 }, { readFile, readdir, readlink }), [100])
})

test('renderer comparison rejects matching software renderers', () => {
  const diagnostics = (renderer) => ({ gpu: { auxAttributes: { glRenderer: renderer } } })

  assert.deepEqual(compareRenderers(diagnostics('AMD Radeon RX 6800'), diagnostics('AMD Radeon RX 6800')), {
    codeRenderer: 'AMD Radeon RX 6800',
    hardwareRenderer: true,
    lvceRenderer: 'AMD Radeon RX 6800',
    sameRenderer: true,
  })
  assert.equal(compareRenderers(diagnostics('llvmpipe (LLVM 20.1)'), diagnostics('llvmpipe (LLVM 20.1)')).hardwareRenderer, false)
})

test('runWithCleanup always cleans up after an error', async () => {
  let cleaned = false

  await assert.rejects(
    runWithCleanup(
      async () => {
        throw new Error('failed')
      },
      async () => {
        cleaned = true
      },
    ),
    /failed/,
  )
  assert.equal(cleaned, true)
})

test('comparison cleans its temporary profile when launch fails', async () => {
  const listComparisonProfiles = async () => (await readdir(tmpdir())).filter((entry) => entry.startsWith('lvce-gpu-comparison-')).sort()
  const before = await listComparisonProfiles()
  const start = Date.now()

  await assert.rejects(
    runComparison({
      code: '/definitely/missing/code',
      idleMs: 0,
      lvce: '/definitely/missing/lvce',
      ozonePlatform: 'x11',
      sampleIntervalMs: 0,
      samples: 1,
    }),
    /ENOENT/,
  )

  assert.ok(Date.now() - start < 5000, 'launch failure should cancel the CDP wait promptly')
  assert.deepEqual(await listComparisonProfiles(), before)
})
