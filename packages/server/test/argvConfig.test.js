import assert from 'node:assert/strict'
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

test('finds the workspace while ignoring repeated link arguments', () => {
  assert.equal(ArgvConfig.getWorkspaceArgument(['--link', '/test/one', '/test/workspace', '--link=/test/two']), '/test/workspace')
})

test('uses the application config directory for argv.json', () => {
  assert.equal(ArgvConfig.getArgvConfigPath({ XDG_CONFIG_HOME: '/test/config' }, '/test/home'), '/test/config/lvce-oss/argv.json')
})
