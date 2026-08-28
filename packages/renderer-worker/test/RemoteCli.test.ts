import { afterEach, expect, test } from '@jest/globals'
import * as RemoteCli from '../src/parts/RemoteCli/RemoteCli.js'

afterEach(() => {
  RemoteCli._reset()
})

test('resolves a remote folder request', () => {
  expect(
    RemoteCli.resolveOpenRequest('remote-ssh://test@example.com/home/test/old', {
      kind: 'folder',
      path: '/home/test/my folder/#project?',
    }),
  ).toEqual({
    fileUri: '',
    workspacePath: '/home/test/my folder/#project?',
    workspaceUri:
      'remote-ssh://test@example.com/home/test/my%20folder/%23project%3F',
  })
})

test('resolves a remote file request to its containing workspace', () => {
  expect(
    RemoteCli.resolveOpenRequest('remote-ssh://test@example.com/home/test/old', {
      kind: 'file',
      path: '/home/test/project/read me.md',
    }),
  ).toEqual({
    fileUri: 'remote-ssh://test@example.com/home/test/project/read%20me.md',
    workspacePath: '/home/test/project',
    workspaceUri: 'remote-ssh://test@example.com/home/test/project',
  })
})

test('rejects invalid remote paths', () => {
  expect(() =>
    RemoteCli.resolveOpenRequest('remote-ssh://test@example.com/home/test', {
      kind: 'folder',
      path: 'relative',
    }),
  ).toThrow('Remote CLI returned an invalid open request')
})
