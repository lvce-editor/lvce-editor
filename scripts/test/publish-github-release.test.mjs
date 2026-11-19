import assert from 'node:assert/strict'
import { test } from 'node:test'
import { finalizeRelease } from '../publish-github-release.mjs'

const RETRIES_EXHAUSTED_ERROR = /Failed to publish GitHub release v1\.2\.3 after 3 attempts/
const INVALID_VERSION_ERROR = /Invalid release version/

test('does not edit an already published release', async () => {
  const commands = []
  await finalizeRelease({
    version: 'v1.2.3',
    run: async (args) => {
      commands.push(args)
      return JSON.stringify({ isDraft: false })
    },
  })
  assert.deepEqual(commands, [['release', 'view', 'v1.2.3', '--json', 'isDraft']])
})

test('retries a transient finalization failure and verifies publication', async () => {
  const commands = []
  const delays = []
  let draft = true
  await finalizeRelease({
    version: 'v1.2.3',
    run: async (args) => {
      commands.push(args)
      if (args[1] === 'edit' && commands.filter((command) => command[1] === 'edit').length === 1) {
        throw new Error('temporary API timeout')
      }
      if (args[1] === 'edit') draft = false
      return JSON.stringify({ isDraft: draft })
    },
    sleep: async (delay) => delays.push(delay),
  })
  assert.deepEqual(delays, [5000])
  assert.equal(commands.filter((command) => command[1] === 'edit').length, 2)
  assert.equal(commands.at(-1)[1], 'view')
})

test('fails clearly after bounded finalization retries', async () => {
  const delays = []
  await assert.rejects(
    finalizeRelease({
      version: 'v1.2.3',
      run: async (args) => {
        if (args[1] === 'edit') throw new Error('API unavailable')
        return JSON.stringify({ isDraft: true })
      },
      sleep: async (delay) => delays.push(delay),
    }),
    RETRIES_EXHAUSTED_ERROR,
  )
  assert.deepEqual(delays, [5000, 15000])
})

test('rejects a version that is not a release tag', async () => {
  await assert.rejects(finalizeRelease({ version: 'v1.2.3; rm -rf /' }), INVALID_VERSION_ERROR)
})
