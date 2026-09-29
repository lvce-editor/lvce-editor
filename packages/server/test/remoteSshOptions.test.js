import assert from 'node:assert/strict'
import test from 'node:test'
import { getRemoteSshOptions, isAuthenticatedRemoteRequest } from '../src/remoteSshOptions.js'

test('uses the regular server defaults without the remote flag', () => {
  assert.deepEqual(getRemoteSshOptions([], {}), {
    enabled: false,
    host: 'localhost',
    idleTimeout: 10_800_000,
    port: 3000,
    token: '',
  })
})

test('parses private remote SSH server options', () => {
  assert.deepEqual(getRemoteSshOptions(['--as-remote-ssh-server', '--port=45123', '--connection-token=secret', '--idle-timeout=25'], {}), {
    enabled: true,
    host: '127.0.0.1',
    idleTimeout: 25,
    port: 45123,
    token: 'secret',
  })
})

test('uses the last value when an explicit argument follows argv.json arguments', () => {
  assert.deepEqual(
    getRemoteSshOptions(
      ['--as-remote-ssh-server', '--port=3000', '--connection-token=config', '--port=45123', '--connection-token=explicit'],
      {},
    ),
    {
      enabled: true,
      host: '127.0.0.1',
      idleTimeout: 10_800_000,
      port: 45123,
      token: 'explicit',
    },
  )
})

test('requires an authentication token in remote mode', () => {
  assert.throws(() => getRemoteSshOptions(['--as-remote-ssh-server'], {}), /requires --connection-token/)
})

test('accepts only the configured query token', () => {
  const options = getRemoteSshOptions(['--as-remote-ssh-server', '--connection-token=secret'], {})
  assert.equal(isAuthenticatedRemoteRequest({ url: '/websocket/terminal-process?token=secret' }, options), true)
  assert.equal(isAuthenticatedRemoteRequest({ url: '/websocket/terminal-process?token=wrong' }, options), false)
  assert.equal(isAuthenticatedRemoteRequest({ url: '/websocket/terminal-process' }, options), false)
})
