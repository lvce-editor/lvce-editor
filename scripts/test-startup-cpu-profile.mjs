import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { build } from 'esbuild'

const root = process.cwd()
const electron = process.env.LVCE_ELECTRON_PATH
assert.ok(electron, 'Set LVCE_ELECTRON_PATH to the Electron executable')
const directory = await mkdtemp(join(tmpdir(), 'lvce-startup-acceptance-'))
const packaged = process.env.LVCE_CPU_PROFILE_PACKAGED === '1'
const outputs = []
const snapshot = async (directory) => {
  const files = {}
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) Object.assign(files, await snapshot(path))
    else
      files[path] = createHash('sha256')
        .update(await readFile(path))
        .digest('hex')
  }
  return files
}
try {
  const project = join(directory, 'project')
  const extension = join(directory, 'extension')
  await mkdir(project)
  await mkdir(extension)
  await writeFile(join(project, 'target.txt'), 'cpu-profile-acceptance')
  await writeFile(
    join(extension, 'extension.json'),
    JSON.stringify({
      id: 'test.cpu-profile',
      name: 'CPU profile test',
      browser: 'main.js',
      isolated: true,
      activation: ['onDiagnostic:plaintext'],
      diagnosticProviders: [{ id: 'test.cpu-profile', languageId: 'plaintext' }],
      workerName: 'CPU profile test worker',
    }),
  )
  await build({
    bundle: true,
    entryPoints: ['scripts/fixtures/cpu-profile/diagnostics.js'],
    external: ['node:*', 'electron'],
    format: 'esm',
    outfile: join(extension, 'main.js'),
    platform: 'browser',
  })
  const env = { ...process.env, LVCE_ROOT: root, LVCE_SHARED_PROCESS_PATH: join(root, 'packages/shared-process/src/sharedProcessMain.ts'), DEV: '1' }
  if (packaged) {
    delete env.LVCE_ROOT
    delete env.LVCE_SHARED_PROCESS_PATH
    delete env.DEV
  }
  delete env.ELECTRON_RUN_AS_NODE
  for (const name of ['CONFIG', 'DATA', 'STATE', 'CACHE']) env[`XDG_${name}_HOME`] = join(directory, name.toLowerCase())
  const previous = join(project, 'previous.txt')
  await writeFile(previous, 'previous editor session')
  const baseline = spawnSync(
    electron,
    [...(packaged ? [] : [join(root, 'packages/main-process')]), '--no-sandbox', '--password-store=basic', previous, '--wait-10-seconds'],
    { cwd: root, env, encoding: 'utf8', timeout: 30_000, maxBuffer: 10 * 1024 * 1024 },
  )
  assert.ifError(baseline.error)
  assert.equal(baseline.status, 0, baseline.stdout + baseline.stderr)
  const sessionDirectory = join(env.XDG_CACHE_HOME, 'lvce-oss/userdata/Partitions/lvce-oss')
  const savedSession = await snapshot(sessionDirectory)
  assert.ok(Object.keys(savedSession).length > 0, 'Normal startup did not create session storage')
  const savedBytes = await Promise.all(Object.keys(savedSession).map((path) => readFile(path)))
  assert.ok(
    savedBytes.some((bytes) => bytes.includes(Buffer.from('previous.txt')) || bytes.includes(Buffer.from('previous.txt', 'utf16le'))),
    'Normal startup did not persist the previous editor',
  )
  const savedWindow = join(env.XDG_CACHE_HOME, 'lvce-oss/window-state.json')
  await mkdir(join(env.XDG_CACHE_HOME, 'lvce-oss'), { recursive: true })
  const original = JSON.stringify({ x: 42, y: 42, width: 777, height: 555, maximized: false })
  await writeFile(savedWindow, original)
  for (const mode of ['configured', 'default', 'provider-error']) {
    await writeFile(join(project, 'target.txt'), `cpu-profile-acceptance ${mode}`)
    const args = [
      ...(packaged ? [] : [join(root, 'packages/main-process')]),
      '--no-sandbox',
      '--password-store=basic',
      project,
      '--open',
      'target.txt',
      '--cpu-profile',
      '--link',
      extension,
    ]
    if (mode !== 'default') args.push('--cpu-profile-dir', directory)
    const result = spawnSync(electron, args, { cwd: root, env, encoding: 'utf8', timeout: 80_000, maxBuffer: 10 * 1024 * 1024 })
    assert.ifError(result.error)
    assert.equal(result.status, mode === 'provider-error' ? 1 : 0, result.stdout + result.stderr)
    const output = result.stdout.match(/CPU profile: (.+)/)?.[1]
    assert.ok(output, result.stdout + result.stderr)
    outputs.push(output)
    const manifest = JSON.parse(await readFile(join(output, 'manifest.json'), 'utf8'))
    if (mode === 'provider-error') assert.match(manifest.errors.join('\n'), /CPU profile acceptance provider error/)
    else assert.deepEqual(manifest.errors, [])
    assert.ok(manifest.utilities.length > 0)
    for (const { file } of manifest.utilities) {
      const profile = JSON.parse(await readFile(join(output, file), 'utf8'))
      assert.ok(profile.nodes.length && profile.samples.length)
    }
    const trace = JSON.parse(await readFile(join(output, manifest.trace), 'utf8'))
    assert.ok(trace.traceEvents.length > 0)
    if (mode !== 'provider-error') {
      const nodes = trace.traceEvents.flatMap((event) => event.args?.data?.cpuProfile?.nodes || [])
      assert.ok(
        nodes.some((node) => node.callFrame.functionName === 'cpuProfileDiagnosticWork'),
        'Delayed diagnostic work was not captured',
      )
    }
    assert.equal(await readFile(savedWindow, 'utf8'), original)
    assert.deepEqual(await snapshot(sessionDirectory), savedSession)
  }
  assert.equal(new Set(outputs).size, 3)
  console.log('Integrated startup CPU profiling acceptance passed.')
} finally {
  if (process.env.KEEP_CPU_PROFILE_TEST) console.log(`Preserved CPU profile acceptance directory: ${directory}`)
  else {
    for (const output of outputs) await rm(output, { recursive: true, force: true })
    await rm(directory, { recursive: true, force: true })
  }
}
