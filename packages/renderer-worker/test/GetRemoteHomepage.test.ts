import { expect, test } from '@jest/globals'
import { getRemoteHomepage } from '../src/parts/GetRemoteHomepage/GetRemoteHomepage.js'

test.each([
  'git@github.com:owner/repository.git',
  'subdomain@github.com/owner/repository.git',
  'ssh://git@github.com/owner/repository.git',
  'https://github.com/owner/repository.git',
  'https://github.com/owner/repository/',
  'git://github.com/owner/repository',
])('maps %s to the GitHub repository homepage', (remote) => {
  expect(getRemoteHomepage(remote)).toBe('https://github.com/owner/repository')
})

test.each([
  'git@levivilet.github.com:owner/repository.git',
  'ssh://git@levivilet.github.com/owner/repository.git',
])('maps GitHub hostname aliases %s to the GitHub repository homepage', (remote) => {
  expect(getRemoteHomepage(remote)).toBe('https://github.com/owner/repository')
})

test('maps a host to a configured local server and base path', () => {
  expect(getRemoteHomepage('subdomain@github.com:owner/repo.git', { 'github.com': 'http://localhost:3001/mirror/' })).toBe(
    'http://localhost:3001/mirror/owner/repo',
  )
})

test('maps a GitHub hostname alias to the configured canonical host', () => {
  expect(getRemoteHomepage('git@levivilet.github.com:owner/repo.git', { 'github.com': 'http://localhost:3001/mirror/' })).toBe(
    'http://localhost:3001/mirror/owner/repo',
  )
})

test.each([
  '',
  '/tmp/repo.git',
  'file:///tmp/repo.git',
  'git@unknown.com:owner/repo',
  'https://github.com/',
  'git@github.com:../repo',
  'git@github.com.evil.example:owner/repo',
  'git@nested.levivilet.github.com:owner/repo',
])(
  'ignores unsupported remote %s',
  (remote) => {
    expect(getRemoteHomepage(remote)).toBe('')
  },
)

test.each([null, {}, { 'github.com': 1 }, { 'github.com': 'javascript:alert(1)' }, { 'github.com': 'http://user:pass@localhost' }])(
  'ignores invalid mappings %j',
  (hosts) => {
    expect(getRemoteHomepage('git@github.com:owner/repo', hosts)).toBe('')
  },
)
