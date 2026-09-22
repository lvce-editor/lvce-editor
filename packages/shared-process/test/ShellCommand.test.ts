import { afterEach, expect, jest, test } from '@jest/globals'
import { execFile } from 'node:child_process'
import { chmod, lstat, mkdir, mkdtemp, readFile, readlink, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { getInstallScript, installLink } from '../src/parts/ShellCommand/ShellCommand.ts'

const execFileAsync = promisify(execFile)
const testPosix = process.platform === 'win32' ? test.skip : test
const roots: string[] = []
const setup = async (): Promise<{ destination: string; root: string; source: string }> => {
  const root = await mkdtemp(join(tmpdir(), 'lvce-install-cli-'))
  roots.push(root)
  const source = join(root, "Lvce's Editor $(false).app", 'bin', 'lvce')
  await mkdir(join(source, '..'), { recursive: true })
  await writeFile(source, '#!/bin/sh\nprintf "1.2.3\\n"\n')
  await chmod(source, 0o755)
  return { destination: join(root, 'path', 'lvce'), root, source }
}

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { force: true, recursive: true })))
})

testPosix('installs an executable link on PATH and can run it; reinstall is harmless', async () => {
  const { destination, root, source } = await setup()
  const elevate = jest.fn(async () => {})
  await expect(installLink(source, destination, elevate)).resolves.toBe(destination)
  await expect(installLink(source, destination, elevate)).resolves.toBe(destination)
  expect(await readlink(destination)).toBe(source)
  const { stdout } = await execFileAsync('/bin/sh', ['-c', 'lvce -v'], { env: { PATH: join(root, 'path') } })
  expect(stdout).toBe('1.2.3\n')
  expect(elevate).not.toHaveBeenCalled()
})

testPosix.each(['file', 'symlink'])('preserves a conflicting %s, including dangling links', async (kind) => {
  const { destination, source } = await setup()
  await mkdir(join(destination, '..'))
  if (kind === 'file') {
    await writeFile(destination, 'existing command')
  } else {
    await symlink('/missing/other-command', destination)
  }
  const elevate = jest.fn(async () => {})
  await expect(installLink(source, destination, elevate)).rejects.toThrow('already exists')
  if (kind === 'file') {
    expect(await readFile(destination, 'utf8')).toBe('existing command')
  } else {
    expect(await readlink(destination)).toBe('/missing/other-command')
  }
  expect(elevate).not.toHaveBeenCalled()
})

testPosix('rejects missing launcher before creating destination or prompting', async () => {
  const { destination, source } = await setup()
  await rm(source)
  const elevate = jest.fn(async () => {})
  await expect(installLink(source, destination, elevate)).rejects.toThrow()
  await expect(lstat(join(destination, '..'))).rejects.toMatchObject({ code: 'ENOENT' })
  expect(elevate).not.toHaveBeenCalled()
})

testPosix('elevated script quotes paths literally and refuses to replace a raced-in command', async () => {
  const { destination, source } = await setup()
  const script = getInstallScript(source, destination)
  await execFileAsync('/bin/sh', ['-c', script])
  expect(await readlink(destination)).toBe(source)
  await expect(execFileAsync('/bin/sh', ['-c', script])).rejects.toThrow()
  expect(await readlink(destination)).toBe(source)
})
