import { expect, test } from '@jest/globals'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { execPromise } from '../src/parts/ExecPromise/ExecPromise.ts'
import { getGitRemote } from '../src/parts/GetGitRemote/GetGitRemote.ts'

test('reads origin from the selected workspace, including a path with spaces', async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'lvce remote '))
  try {
    await execPromise('git', ['init'], { cwd })
    expect(await getGitRemote(cwd)).toBe('')
    await execPromise('git', ['remote', 'add', 'origin', 'git@github.com:owner/repository.git'], { cwd })
    expect(await getGitRemote(cwd)).toBe('git@github.com:owner/repository.git')
  } finally {
    await rm(cwd, { force: true, recursive: true })
  }
})

test('rejects an empty workspace instead of reading the process working directory', async () => {
  await expect(getGitRemote('')).rejects.toThrow('Expected a workspace path')
})
