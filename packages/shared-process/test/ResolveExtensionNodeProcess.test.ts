import { afterEach, expect, jest, test } from '@jest/globals'
import { mkdir, mkdtemp, realpath, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

const getExtensions = jest.fn<() => Promise<any[]>>()

jest.unstable_mockModule('../src/parts/ExtensionManagement/ExtensionManagement.js', () => ({
  getExtensions,
}))

const ResolveExtensionNodeProcess = await import('../src/parts/ResolveExtensionNodeProcess/ResolveExtensionNodeProcess.js')

const roots: string[] = []

const createFixture = async (rpc: any = { id: 'git-client', name: 'Git', type: 'node-process', url: 'node/process.js' }): Promise<string> => {
  const root = await mkdtemp(path.join(tmpdir(), 'lvce-extension-node-process-'))
  roots.push(root)
  const extensionRoot = path.join(root, 'builtin.git')
  await mkdir(path.join(extensionRoot, 'node'), { recursive: true })
  await writeFile(path.join(extensionRoot, 'node', 'process.js'), 'export {}')
  await writeFile(path.join(extensionRoot, 'extension.json'), JSON.stringify({ rpc: [rpc] }))
  getExtensions.mockResolvedValue([{ id: 'builtin.git', path: extensionRoot }])
  return extensionRoot
}

afterEach(async () => {
  jest.resetAllMocks()
  await Promise.all(roots.splice(0).map((root) => rm(root, { force: true, recursive: true })))
})

test('resolves a declared node process inside the canonical extension root', async () => {
  const extensionRoot = await createFixture()

  await expect(ResolveExtensionNodeProcess.resolveExtensionNodeProcess('builtin.git', 'git-client')).resolves.toEqual({
    name: 'Extension builtin.git: Git',
    path: await realpath(path.join(extensionRoot, 'node', 'process.js')),
  })
})

test('resolves an installed third-party extension without prompting', async () => {
  const extensionRoot = await createFixture({ id: 'client', type: 'node-process', url: 'node/process.js' })
  getExtensions.mockResolvedValue([{ id: 'publisher.extension', path: extensionRoot }])

  await expect(ResolveExtensionNodeProcess.resolveExtensionNodeProcess('publisher.extension', 'client')).resolves.toMatchObject({
    name: 'Extension publisher.extension: client',
  })
})

test('rejects undeclared, wrong-type, and invalid requests', async () => {
  await createFixture({ id: 'git-client', type: 'node', url: 'node/process.js' })

  await expect(ResolveExtensionNodeProcess.resolveExtensionNodeProcess('builtin.git', 'git-client')).rejects.toThrow(
    'Node process git-client is not declared',
  )
  await expect(ResolveExtensionNodeProcess.resolveExtensionNodeProcess('builtin.git', 'missing')).rejects.toThrow(
    'Node process missing is not declared',
  )
  await expect(ResolveExtensionNodeProcess.resolveExtensionNodeProcess('../builtin.git', 'git-client')).rejects.toThrow(
    'Invalid extension node process extension id',
  )
})

test('rejects traversal and symlink escapes', async () => {
  const extensionRoot = await createFixture({ id: 'git-client', type: 'node-process', url: '../outside.js' })
  const root = path.dirname(extensionRoot)
  await writeFile(path.join(root, 'outside.js'), 'export {}')

  await expect(ResolveExtensionNodeProcess.resolveExtensionNodeProcess('builtin.git', 'git-client')).rejects.toThrow(
    'Extension node process path escapes the extension root',
  )

  await writeFile(
    path.join(extensionRoot, 'extension.json'),
    JSON.stringify({ rpc: [{ id: 'git-client', type: 'node-process', url: 'node/process-link.js' }] }),
  )
  await symlink(path.join(root, 'outside.js'), path.join(extensionRoot, 'node', 'process-link.js'))
  await expect(ResolveExtensionNodeProcess.resolveExtensionNodeProcess('builtin.git', 'git-client')).rejects.toThrow(
    'Extension node process path escapes the extension root',
  )
})

test('rejects absolute process urls on every platform', async () => {
  await createFixture({ id: 'git-client', type: 'node-process', url: 'C:\\outside\\process.js' })

  await expect(ResolveExtensionNodeProcess.resolveExtensionNodeProcess('builtin.git', 'git-client')).rejects.toThrow('must use a relative url')
})
