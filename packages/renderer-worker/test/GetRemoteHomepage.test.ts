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

test('maps a host to a configured local server and base path', () => {
  expect(getRemoteHomepage('subdomain@github.com:owner/repo.git', { 'github.com': 'http://localhost:3001/mirror/' })).toBe(
    'http://localhost:3001/mirror/owner/repo',
  )
})

test.each(['', '/tmp/repo.git', 'file:///tmp/repo.git', 'git@unknown.com:owner/repo', 'https://github.com/', 'git@github.com:../repo'])(
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
