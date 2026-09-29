import { afterEach, expect, test } from '@jest/globals'
import { mkdir, mkdtemp, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import * as ResolveExtensionNodeRpcPath from '../src/parts/ResolveExtensionNodeRpcPath/ResolveExtensionNodeRpcPath.ts'

const roots: string[] = []
const originalRemoteExtensionsPath = process.env.LVCE_REMOTE_EXTENSIONS_PATH

const createFixture = async (rpcUrl = 'node/src/gitClient.js'): Promise<string> => {
  const root = await mkdtemp(path.join(tmpdir(), 'lvce-remote-extensions-'))
  roots.push(root)
  const extensionRoot = path.join(root, 'builtin.git')
  await mkdir(path.join(extensionRoot, 'node', 'src'), { recursive: true })
  await writeFile(path.join(extensionRoot, 'node', 'src', 'gitClient.js'), 'export {}')
  await writeFile(path.join(extensionRoot, 'extension.json'), JSON.stringify({ rpc: [{ id: 'git-client', type: 'node', url: rpcUrl }] }))
  process.env.LVCE_REMOTE_EXTENSIONS_PATH = root
  return root
}

afterEach(async () => {
  if (originalRemoteExtensionsPath === undefined) {
    delete process.env.LVCE_REMOTE_EXTENSIONS_PATH
  } else {
    process.env.LVCE_REMOTE_EXTENSIONS_PATH = originalRemoteExtensionsPath
  }
  await Promise.all(roots.splice(0).map((root) => rm(root, { force: true, recursive: true })))
})

test('resolves a declared node rpc inside the remote extension root', async () => {
  const root = await createFixture()

  await expect(ResolveExtensionNodeRpcPath.resolveExtensionNodeRpcPath('builtin.git', 'git-client')).resolves.toBe(
    await realpath(path.join(root, 'builtin.git', 'node', 'src', 'gitClient.js')),
  )
})

test('rejects undeclared and invalid rpc identifiers', async () => {
  await createFixture()

  await expect(ResolveExtensionNodeRpcPath.resolveExtensionNodeRpcPath('builtin.git', 'missing')).rejects.toThrow('Node rpc missing is not declared')
  await expect(ResolveExtensionNodeRpcPath.resolveExtensionNodeRpcPath('../builtin.git', 'git-client')).rejects.toThrow(
    'Invalid extension node rpc extension id',
  )
})

test('rejects a declared rpc path outside the extension root', async () => {
  const root = await createFixture('../outside.js')
  await writeFile(path.join(root, 'outside.js'), 'export {}')

  await expect(ResolveExtensionNodeRpcPath.resolveExtensionNodeRpcPath('builtin.git', 'git-client')).rejects.toThrow(
    'Extension node rpc path escapes the extension root',
  )
})
