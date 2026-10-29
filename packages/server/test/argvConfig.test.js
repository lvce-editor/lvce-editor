import assert from 'node:assert/strict'
import { join } from 'node:path'
import test from 'node:test'
import * as ArgvConfig from '../src/argvConfig.js'

test('converts object values into command line arguments', () => {
  assert.deepEqual(
    ArgvConfig.parseArgvConfig(`{
      // Extension development paths can be repeated.
      "link": ["/test/one", "/test/two"],
      "disable-custom-worker-paths": true,
      "public": false,
      "port": 3000
    }`),
    ['--link=/test/one', '--link=/test/two', '--disable-custom-worker-paths', '--port=3000'],
  )
})

test('prepends config arguments before explicit command line arguments', () => {
  const argv = ['/usr/bin/node', '/usr/lib/lvce/server.js', '--theme=explicit']

  ArgvConfig.prepend(argv, ['--link=/test/extension', '--theme=configured'])

  assert.deepEqual(argv, ['/usr/bin/node', '/usr/lib/lvce/server.js', '--link=/test/extension', '--theme=configured', '--theme=explicit'])
})

test('adds the default native memory reclaimer feature without losing enabled features', () => {
  assert.deepEqual(ArgvConfig.addDefaultMemoryReclaimerFeature(['--enable-features=ExampleFeature', '/workspace']), [
    '--enable-features=ExampleFeature,PartitionAllocMemoryReclaimer:interval/1800s',
    '/workspace',
  ])
})

test('preserves an explicitly configured native memory reclaimer interval', () => {
  assert.deepEqual(ArgvConfig.addDefaultMemoryReclaimerFeature(['--enable-features=ExampleFeature,PartitionAllocMemoryReclaimer:interval/32s']), [
    '--enable-features=ExampleFeature,PartitionAllocMemoryReclaimer:interval/32s',
  ])
})

test('honors an explicit native memory reclaimer disable', () => {
  const args = ['--disable-features=ExampleFeature,PartitionAllocMemoryReclaimer', '/workspace']
  assert.equal(ArgvConfig.addDefaultMemoryReclaimerFeature(args), args)
})

test('combines repeated feature switches and replaces a bare native reclaimer entry', () => {
  assert.deepEqual(
    ArgvConfig.addDefaultMemoryReclaimerFeature([
      '--enable-features',
      'ExampleFeature,PartitionAllocMemoryReclaimer',
      '--enable-features=OtherFeature,PartitionAllocMemoryReclaimer:interval/45s',
      '/workspace',
    ]),
    ['--enable-features=ExampleFeature,PartitionAllocMemoryReclaimer:interval/45s,OtherFeature', '/workspace'],
  )
})

test('finds the workspace while ignoring repeated link arguments', () => {
  assert.equal(ArgvConfig.getWorkspaceArgument(['--link', '/test/one', '/test/workspace', '--link=/test/two']), '/test/workspace')
})

test('uses the application config directory for argv.json', () => {
  assert.equal(ArgvConfig.getArgvConfigPath({ XDG_CONFIG_HOME: '/test/config' }, '/test/home'), join('/test/config', 'lvce-oss', 'argv.json'))
})

test('worker path options do not become workspace arguments', () => {
  assert.equal(
    ArgvConfig.getWorkspaceArgument(['--process-explorer-worker=relative worker.js', '--process-explorer=/native/process.ts', '/workspace']),
    '/workspace',
  )
  assert.equal(ArgvConfig.getWorkspaceArgument(['--process-explorer-worker=/worker.js']), '')
  assert.equal(ArgvConfig.getWorkspaceArgument(['--hover-worker=relative hover worker.js', '/workspace']), '/workspace')
  assert.equal(ArgvConfig.getWorkspaceArgument(['--hover-worker=/worker.js']), '')
})
